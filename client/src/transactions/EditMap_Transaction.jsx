import jsTPS_Transaction from "../common/jsTPS.jsx"
var jsondiffpatch = require('jsondiffpatch');
var _ = require('lodash');

export default class EditMap_Transaction extends jsTPS_Transaction {
    constructor(initStore, initDelta) {
        super();
        this.store = initStore;
        this.delta = initDelta;
    }

    doTransaction() {
        jsondiffpatch.patch(this.store.currentMap, this.delta);
    }
    
    undoTransaction() {
        jsondiffpatch.unpatch(this.store.currentMap, this.delta);
    }
}