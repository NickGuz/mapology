import jsTPS_Transaction from '../common/jsTPS.jsx';
import { updateAllFeatures } from '../store/GlobalStoreHttpRequestApi';
const jsondiffpatch = require('jsondiffpatch');
const _ = require('lodash');

export default class EditMap_Transaction extends jsTPS_Transaction {
  constructor(initStore, initDelta) {
    super();
    this.store = initStore;
    this.delta = initDelta;
  }

  doTransaction() {
    jsondiffpatch.patch(this.store.currentMap, this.delta);
    updateAllFeatures(
      this.store.currentMap.mapInfo.id,
      this.store.currentMap.json
    );
  }

  undoTransaction() {
    jsondiffpatch.unpatch(this.store.currentMap, this.delta);
    updateAllFeatures(
      this.store.currentMap.mapInfo.id,
      this.store.currentMap.json
    );
  }
}
