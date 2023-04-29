import jsTPS_Transaction from "../common/jsTPS.jsx"
var jsondiffpatch = require('jsondiffpatch');
var _ = require('lodash');

export default class EditMap_Transaction extends jsTPS_Transaction {
    constructor(initStore, initOldMap, initDelta) {
        super();
        this.store = initStore;
        this.oldMap = initOldMap;
        this.delta = initDelta;
      
    }

    doTransaction() {
        
    }
    
    undoTransaction() {
        jsondiffpatch.unpatch(this.store.currentMap, this.delta);
    }
}