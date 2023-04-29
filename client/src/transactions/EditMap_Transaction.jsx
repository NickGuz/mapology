import jsTPS_Transaction from "../common/jsTPS.jsx"
var jsondiffpatch = require('jsondiffpatch');
var _ = require('lodash');

export default class EditMap_Transaction extends jsTPS_Transaction {
    constructor(initStore, initOldMap) {
        super();
        this.store = initStore;
        this.oldMap = initOldMap;
      
    }

    doTransaction() {
        
    }
    
    undoTransaction() {
        console.log(_.isEqual(this.oldMap,this.store.currentMap));
        let delta = jsondiffpatch.diff(this.oldMap,this.store.currentMap);
        jsondiffpatch.unpatch(this.store.currentMap, delta);
        console.log(_.isEqual(this.oldMap,this.store.currentMap));

        this.store.setCurrentMap(this.store.currentMap);
        
        
    }
}