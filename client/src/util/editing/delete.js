import * as RequestApi from '../../store/GlobalStoreHttpRequestApi';

const removeVertex = (evt, store) => {
  if (!window.confirm('Are you sure you want to delete this vertex?')) {
    return;
  }

  let mapClone = JSON.parse(JSON.stringify(store.currentMap));

  const vertex = evt.markerEvent.latlng;
  const lat = vertex.lat;
  const lng = vertex.lng;
  // console.log("to delete", vertex);

  // // Get the vertices to remove
  let toRemove = [];
  store.currentMap.json.features.forEach((f) => {
    f.geometry.coordinates.forEach((polygon) => {
      if (f.geometry.type === 'MultiPolygon') {
        polygon[0].forEach((coord) => {
          if (
            Math.abs(coord[0] - lng) < 0.0001 &&
            Math.abs(coord[1] - lat) < 0.0001
          ) {
            toRemove.push(f);
          }
        });
      } else if (f.geometry.type === 'Polygon') {
        console.log('polygon', polygon);
        polygon.forEach((coord) => {
          if (
            Math.abs(coord[0] - lng) < 0.0001 &&
            Math.abs(coord[1] - lat) < 0.0001
          ) {
            toRemove.push(f);
          }
        });
      }
    });
  });

  if (toRemove.length >= 3) {
    window.alert('Cannot delete a vertex shared by more than 2 regions');
    return;
  }

  // Remove the vertices
  toRemove.forEach((f) => {
    if (f.geometry.type === 'MultiPolygon') {
      for (let polygon of f.geometry.coordinates) {
        polygon[0] = polygon[0].filter(
          (coords) =>
            !(
              Math.abs(coords[0] - lng) < 0.0001 &&
              Math.abs(coords[1] - lat) < 0.0001
            )
        );
      }
    } else {
      f.geometry.coordinates[0] = f.geometry.coordinates[0].filter(
        (coords) =>
          !(
            Math.abs(coords[0] - lng) < 0.0001 &&
            Math.abs(coords[1] - lat) < 0.0001
          )
      );
    }
  });

  store.setCurrentMap(store.currentMap);
  toRemove.forEach((f) => {
    RequestApi.updateFeatureGeometry(f.id, f.geometry);
  });

  store.addEditMapTransaction(mapClone, store.currentMap);
};

const deleteFeature = (feature, store) => {
  let mapClone = JSON.parse(JSON.stringify(store.currentMap));
  RequestApi.deleteFeature(feature.id);
  store.currentMap.json.features = store.currentMap.json.features.filter(
    (f) => f.id !== feature.id
  );
  store.setCurrentMap(store.currentMap);
  store.addEditMapTransaction(mapClone, store.currentMap);
};

export { removeVertex, deleteFeature };
