import * as turf from '@turf/turf';
import * as RequestApi from '../../store/GlobalStoreHttpRequestApi';

const splitRegion = async (line, store) => {
  store.setSelectedFeatures([]);

  if (line.geometry.coordinates.length !== 2) {
    window.alert('Split line must have 2 points');
    return;
  }

  const mapClone = JSON.parse(JSON.stringify(store.currentMap));

  const startPoint = line.geometry.coordinates[0];
  const endPoint = line.geometry.coordinates[1];

  const featureToSplit = findFeatureWithPoints(
    startPoint,
    endPoint,
    store.currentMap.json.features
  );
  if (!featureToSplit) {
    return;
  }
  const isMultiPolygon = featureToSplit.geometry.type === 'MultiPolygon';
  console.log('featureToSplit', featureToSplit);

  // const collection = turf.flatten(featureToSplit);

  let contains = false;
  featureToSplit.geometry.coordinates.forEach((poly) => {
    if (contains) return;

    console.log('poly', poly[0]);
    const polygon = isMultiPolygon
      ? turf.polygon([poly[0]])
      : turf.polygon([poly]);
    console.log('polygon', polygon);
    contains = turf.booleanContains(polygon, line);
  });

  // const contains = turf.booleanContains(featureToSplit, line);
  // console.log('contains', contains);

  if (!contains) {
    console.log('Invalid split');
    return;
  }

  const split = isMultiPolygon
    ? splitMultiPolygon(featureToSplit, line)
    : splitPolygon(featureToSplit, line);

  // const split = splitPolygon(featureToSplit, line);
  if (!split) {
    console.log('error');
    return;
  }

  store.currentMap.json.features = store.currentMap.json.features.filter(
    (f) => f.id !== featureToSplit.id
  );

  if (isMultiPolygon) {
    const featureClone = split.feature;
    const splitPoly = split.splitPoly;

    console.log('featureClone', featureClone);

    RequestApi.updateFeatureGeometry(featureClone.id, featureClone.geometry);
    store.currentMap.json.features.push(featureClone);

    for (let poly of splitPoly.geometry.coordinates) {
      const newPoly = turf.polygon(poly, featureClone.properties);
      const res = await RequestApi.insertFeature(
        store.currentMap.mapInfo.id,
        newPoly
      );
      store.currentMap.json.features.push(res.data.data);
    }
  } else {
    console.log('split', split);
    const poly1 = split.geometry.coordinates[0];
    const poly2 = split.geometry.coordinates[1];

    console.log('poly1', poly1);
    console.log('poly2', poly2);

    const feature1 = turf.feature(
      turf.polygon(poly1).geometry,
      featureToSplit.properties
    );
    const feature2 = turf.feature(
      turf.polygon(poly2).geometry,
      featureToSplit.properties
    );

    console.log('feature1', feature1);
    console.log('feature2', feature2);

    await RequestApi.deleteFeature(featureToSplit.id);

    const res1 = await RequestApi.insertFeature(
      store.currentMap.mapInfo.id,
      feature1
    );

    const res2 = await RequestApi.insertFeature(
      store.currentMap.mapInfo.id,
      feature2
    );

    const newFeature1 = res1.data.data;
    const newFeature2 = res2.data.data;
    store.currentMap.json.features.push(newFeature1);
    store.currentMap.json.features.push(newFeature2);
  }

  // store.currentMap.json.features.push(split);
  store.setCurrentMap(store.currentMap);
  store.setSelectedFeatures([]); // TODO this not working for some reason

  store.addEditMapTransaction(mapClone, store.currentMap);
};

const splitPolygon = (feature, line) => {
  const lineString = line.geometry;

  const point1 = lineString.coordinates[0];
  const point2 = lineString.coordinates[1];

  const poly1Points = [];
  const poly2Points = [];
  let foundPoints = 0;
  feature.geometry.coordinates[0].forEach((p) => {
    if (foundPoints === 0) {
      poly1Points.push(p);

      if (pointEquals(p, point1) || pointEquals(p, point2)) {
        console.log('equals1');
        poly2Points.push(p);
        foundPoints++;
      }
    } else if (foundPoints === 1) {
      poly2Points.push(p);

      if (pointEquals(p, point1) || pointEquals(p, point2)) {
        console.log('equals2');
        poly1Points.push(p);
        foundPoints++;
      }
    } else {
      poly1Points.push(p);
    }
  });

  if (poly1Points.length === 0 || poly2Points.length === 0) {
    throw new Error('Failed to find any points');
  }

  if (!pointEquals(poly1Points[0], poly1Points[poly1Points.length - 1])) {
    poly1Points.push(poly1Points[0]);
  }
  if (!pointEquals(poly2Points[0], poly2Points[poly2Points.length - 1])) {
    poly2Points.push(poly2Points[0]);
  }

  const multiPolygon = turf.multiPolygon(
    [[poly1Points], [poly2Points]],
    feature.properties
  );

  console.log('before', feature);
  console.log('after', multiPolygon);
  return multiPolygon;
};

const splitMultiPolygon = (feature, line) => {
  console.log('splitting MultiPolygon');

  const featureClone = turf.clone(feature);

  const startPoint = line.geometry.coordinates[0];
  const endPoint = line.geometry.coordinates[1];

  // Get the polygon that has the line through it
  let polygon;
  featureClone.geometry.coordinates.forEach((poly) => {
    let contains = 0;

    poly[0].forEach((coord) => {
      if (pointEquals(coord, startPoint) || pointEquals(coord, endPoint)) {
        contains++;
      }
    });

    if (contains >= 2) {
      polygon = poly;
    }
  });

  if (!polygon) {
    console.log('Could not find a polygon to split');
    return;
  }

  // Remove the polygon from the feature
  featureClone.geometry.coordinates = featureClone.geometry.coordinates.filter(
    (poly) => poly !== polygon
  );

  // Split this polygon
  const splitPoly = splitPolygon(turf.polygon(polygon), line);
  console.log('splitPoly', splitPoly);

  // Insert those polygons into the original MultiPolygon
  // splitPoly.geometry.coordinates.forEach((poly) => {
  //   featureClone.geometry.coordinates.push(poly);
  // });

  // Modifying and returning original feature
  return {
    feature: featureClone,
    polygon: polygon,
    splitPoly: splitPoly,
  };
};

const findFeatureWithPoints = (point1, point2, storeFeatures) => {
  const turfPoint1 = turf.point(point1);
  const turfPoint2 = turf.point(point2);
  console.log('turfPoint1', turfPoint1);
  console.log('turfPoint2', turfPoint2);

  const features = storeFeatures.filter((f) => {
    const polygons = [];
    if (f.geometry.type === 'MultiPolygon') {
      const flattened = turf.flatten(f);
      flattened.features.forEach((feature) => polygons.push(feature));
    } else {
      polygons.push(f);
    }

    let contains = false;

    // console.log('polygons', polygons);
    polygons.forEach((feature) => {
      if (contains) return true;
      if (feature.geometry.type === 'Point') return;
      // console.log('polygon', feature);

      let arePointsOnBoundary = false;
      let ringIndex = -1;
      let pointSegment1;
      let pointSegment2;

      feature.geometry.coordinates.forEach((ring, i) => {
        if (arePointsOnBoundary) return true;

        const lineString = turf.lineString(ring);
        arePointsOnBoundary =
          isPointOnLine(
            turfPoint1.geometry.coordinates,
            lineString.geometry.coordinates[0],
            lineString.geometry.coordinates[1]
          ) &&
          isPointOnLine(
            turfPoint2.geometry.coordinates,
            lineString.geometry.coordinates[0],
            lineString.geometry.coordinates[1]
          );
        // turf.booleanPointOnLine(
        //   turfPoint1.geometry.coordinates,
        //   lineString.geometry.coordinates,
        //   {
        //     epsilon: 0.0001,
        //   }
        // ) &&
        // turf.booleanPointOnLine(
        //   turfPoint2.geometry.coordinates,
        //   lineString.geometry.coordinates,
        //   {
        //     epsilon: 0.0001,
        //   }
        // );

        if (arePointsOnBoundary) {
          console.log('feature we inserting in', feature);
          console.log('point1', point1);
          console.log('point2', point2);
          ringIndex = i;
          pointSegment1 = getLineLiesOn(
            turfPoint1,
            feature.geometry.coordinates[ringIndex]
          );
          pointSegment2 = getLineLiesOn(
            turfPoint2,
            feature.geometry.coordinates[ringIndex]
          );
          console.log('SEGMENT1', pointSegment1);
          console.log('SEGMENT2', pointSegment2);
          insertBetween(point1, pointSegment1, feature, ringIndex);
          insertBetween(point2, pointSegment2, feature, ringIndex);
          return;
        }
      });
      // console.log('pointsOnBoundary', arePointsOnBoundary);

      if (arePointsOnBoundary) {
        contains = true;
        return;
      }

      contains =
        feature.geometry.coordinates[0].find((xy) => pointEquals(xy, point1)) &&
        feature.geometry.coordinates[0].find((xy) => pointEquals(xy, point2));
    });

    return contains;
  });

  if (features.length === 0) {
    window.alert(
      'Did not find any feature to split. Please only select existing vertices'
    );
    return null;
  }

  if (features.length > 1) {
    window.alert(
      'Error finding feature to split. Please try a different location'
    );
    return null;
  }

  console.log('returning features', features);
  return features[0];
};

const isPointOnLine = (point, start, end) => {
  const v1 = [point[0] - start[0], point[1] - start[1]];
  const v2 = [end[0] - start[0], end[1] - start[1]];
  const dot = v1[0] * v2[0] + v1[1] * v2[1];
  const length = Math.sqrt(v2[0] * v2[0] + v2[1] * v2[1]);
  const projection = dot / length;
  return projection >= 0 && projection <= 1;
};

const insertBetween = (point, segment, feature, ringIndex) => {
  console.log('feature before', feature);
  const ring = feature.geometry.coordinates[ringIndex];
  const newRing = [];
  const segmentCoords = segment.geometry.coordinates;
  let coordPushed = false;

  // Might break if coord is last in array
  ring.forEach((coord) => {
    newRing.push(coord);
    if (!coordPushed && pointEquals(coord, segmentCoords[0])) {
      console.log('inserting1');
      newRing.push(point);
      coordPushed = true;
    }
    // } else if (pointEquals(coord, segmentCoords[1])) {
    //   console.log('inserting2');
    //   newRing.push(point);
    // }
  });

  feature.geometry.coordinates[ringIndex] = newRing;
  console.log('feature after', feature);
};

const getLineLiesOn = (point, polygon) => {
  let segment;

  turf.segmentEach(
    turf.polygon([polygon]),
    (
      currentSegment,
      featureIndex,
      multiFeatureIndex,
      geometryIndex,
      segmentIndex
    ) => {
      if (segment) {
        return true;
      }

      console.log(
        currentSegment,
        featureIndex,
        multiFeatureIndex,
        geometryIndex,
        segmentIndex
      );

      // if (turf.booleanPointOnLine(point, currentSegment, { epsilon: 0.0001 })) {
      if (
        isPointOnLine(
          point,
          currentSegment.geometry.coordinates[0],
          currentSegment.geometry.coordinates[1]
        )
      ) {
        segment = currentSegment;
      }
    }
  );

  return segment;
};

const pointEquals = (point1, point2) => {
  return (
    Math.abs(point1[0] - point2[0]) < 0.00001 &&
    Math.abs(point1[1] - point2[1]) < 0.00001
  );
};

export { splitRegion };
