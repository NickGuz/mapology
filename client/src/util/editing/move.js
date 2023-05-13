import { updateFeatureGeometry } from '../../store/GlobalStoreHttpRequestApi';

const moveVertex = (evt, store) => {
  let mapClone = JSON.parse(JSON.stringify(store.currentMap));

  const newFeature = evt.layer.toGeoJSON();

  store.currentMap.json.features = store.currentMap.json.features.filter(
    (f) => f.id !== newFeature.id
  );
  store.currentMap.json.features.push(newFeature);
  store.setCurrentMap(store.currentMap);
  updateFeatureGeometry(newFeature.id, newFeature.geometry);
  store.addEditMapTransaction(mapClone, store.currentMap);
};

export { moveVertex };
