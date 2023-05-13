import {
  insertFeature,
  deleteFeature,
} from '../../store/GlobalStoreHttpRequestApi';
import * as turf from '@turf/turf';

const merge = async (store) => {
  const firstGeom = store.selectedFeatures[0];

  let name = window.prompt('Input a name for the merged region');
  if (!name) return;

  let mapClone = JSON.parse(JSON.stringify(store.currentMap));

  const mergedFeature = store.selectedFeatures.reduce((merged, region) => {
    return turf.union(merged, region);
  }, firstGeom);

  mergedFeature.properties.NAME_0 = name;

  // Delete features from DB
  store.selectedFeatures.forEach((f) => {
    deleteFeature(f.id);
  });

  // Add new feature to DB first to get back auto-generated ID
  const res = await insertFeature(store.currentMap.mapInfo.id, mergedFeature);
  const newFeature = res.data.data;

  // Add new feature to current json data
  store.currentMap.json.features.push(newFeature);

  // Delete merged regions
  store.currentMap.json.features = store.currentMap.json.features.filter(
    (region) => !store.selectedFeatures.includes(region)
  );

  // Update the store to rerender
  store.setCurrentMap(store.currentMap);
  store.setSelectedFeatures([]);
  store.addEditMapTransaction(mapClone, store.currentMap);
};

export { merge };
