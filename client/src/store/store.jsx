import { createContext, useState } from 'react';
import { getMapById, getAllMaps } from './GlobalStoreHttpRequestApi';
// import { useNavigate } from "react-router-dom";
import EditMap_Transaction from '../transactions/EditMap_Transaction';
import jsTPS from '../common/jsTPS';
import { getAllMapsByUserId } from './GlobalStoreHttpRequestApi';
var jsondiffpatch = require('jsondiffpatch');

const tps = new jsTPS();

export const GlobalStoreContext = createContext({});

export const GlobalStoreActionType = {
  CHANGE_PAGE_VIEW: 'CHANGE_PAGE_VIEW',
  SET_OPEN_IMPORT_DIALOG: 'SET_OPEN_IMPORT_DIALOG',
  SET_OPEN_SETTINGS_MODAL: 'SET_OPEN_SETTINGS_MODAL',
  CURR_MAP: 'CURR_MAP',
  SET_DISPLAYED_MAPS: 'SET_DISPLAYED_MAPS',
  SET_SELECTED_FEATURES: 'SET_SELECTED_FEATURES',
  SET_SEARCH_TERM: 'SET_SEARCH_TERM',
  SET_SEARCH_TAGS: 'SET_SEARCH_TAGS',
  SET_SORT_TYPE: 'SET_SORT_TYPE',
  SET_CURR_LEGEND: 'SET_CURR_LEGEND',
  SET_MAP_UPDATES: 'SET_MAP_UPDATES',
  SET_SEARCH_BY_VALUE: 'SET_SEARCH_BY_VALUE',
  SET_SORT_BY_VALUE: 'SET_SORT_BY_VALUE',
  SET_CURR_MAP_ID: 'SET_CURR_MAP_ID',
  SET_CAN_SELECT_FEATURES: 'SET_CAN_SELECT_FEATURES',
};

export const PageViewTypes = {
  HOME: 'HOME',
  REGISTER: 'REGISTER',
};

export const SearchByValue = {
  MAP: 'MAP',
  USER: 'USER',
};

export const SortByValue = {
  RELEVANCE: 'RELEVANCE',
  // FEATURED: "FEATURED",
  TOP_RATED: 'TOP_RATED',
  RECENTLY_UPDATED: 'RECENTLY_UPDATED',
};

function GlobalStoreContextProvider(props) {
  // const { auth } = useContext(AuthContext);
  const [store, setStore] = useState({
    pageView: PageViewTypes.HOME,
    importDialogOpen: false,
    settingsModalOpen: false,
    currentMap: null,
    currentMapId: null,
    displayedMaps: [],
    selectedFeatures: [],
    mapUpdates: 0,
    searchTerm: null,
    searchTags: [],
    sortType: null,
    currentLegend: {},
    searchByValue: SearchByValue.MAP,
    sortByValue: SortByValue.RELEVANCE,
    canSelectFeatures: true,
  });

  // const navigate = useNavigate();

  const storeReducer = (action) => {
    const { type, payload } = action;
    switch (type) {
      case GlobalStoreActionType.CHANGE_PAGE_VIEW: {
        return setStore({
          ...store,
          pageView: payload,
        });
      }
      case GlobalStoreActionType.SET_OPEN_IMPORT_DIALOG: {
        return setStore({
          ...store,
          importDialogOpen: payload,
        });
      }
      case GlobalStoreActionType.SET_OPEN_SETTINGS_MODAL: {
        return setStore({
          ...store,
          settingsModalOpen: payload,
        });
      }
      case GlobalStoreActionType.CURR_MAP: {
        return setStore({
          ...store,
          currentMap: payload,
          mapUpdates: store.mapUpdates + 1, // this is stupid but using this as GeoJSON key to force an update
        });
      }
      case GlobalStoreActionType.SET_DISPLAYED_MAPS: {
        return setStore({
          ...store,
          displayedMaps: payload,
          importDialogOpen: false,
        });
      }
      case GlobalStoreActionType.SET_SELECTED_FEATURES: {
        return setStore({
          ...store,
          selectedFeatures: payload,
        });
      }
      case GlobalStoreActionType.SET_SEARCH_TERM: {
        return setStore({
          ...store,
          searchTerm: payload,
        });
      }
      case GlobalStoreActionType.SET_SEARCH_TAGS: {
        return setStore({
          ...store,
          searchTags: payload,
        });
      }
      case GlobalStoreActionType.SET_SORT_TYPE: {
        return setStore({
          ...store,
          sortType: payload,
        });
      }
      case GlobalStoreActionType.SET_CURR_LEGEND: {
        return setStore({
          ...store,
          currentLegend: payload,
        });
      }
      case GlobalStoreActionType.SET_MAP_UPDATES: {
        return setStore({
          ...store,
          mapUpdates: payload,
        });
      }
      case GlobalStoreActionType.SET_SEARCH_BY_VALUE: {
        return setStore({
          ...store,
          searchByValue: payload,
        });
      }
      case GlobalStoreActionType.SET_SORT_BY_VALUE: {
        return setStore({
          ...store,
          sortByValue: payload,
        });
      }
      case GlobalStoreActionType.SET_CURR_MAP_ID: {
        return setStore({
          ...store,
          currentMapId: payload,
        });
      }
      case GlobalStoreActionType.SET_CAN_SELECT_FEATURES: {
        return setStore({
          ...store,
          canSelectFeatures: payload,
        });
      }
      default: {
        return store;
      }
    }
  };

  store.setOpenImportDialog = (open) => {
    storeReducer({
      type: GlobalStoreActionType.SET_OPEN_IMPORT_DIALOG,
      payload: open,
    });
  };

  store.setOpenSettingsModal = (open) => {
    storeReducer({
      type: GlobalStoreActionType.SET_OPEN_SETTINGS_MODAL,
      payload: open,
    });
  };

  store.setCurrentMap = (map) => {
    storeReducer({
      type: GlobalStoreActionType.CURR_MAP,
      payload: map,
    });
  };

  store.getMapById = async (id) => {
    // async function asyncGetMapById(id) {
    let response = await getMapById(id);
    if (response.status == 200) {
      let map = response.data.data;
      storeReducer({
        type: GlobalStoreActionType.CURR_MAP,
        payload: map,
      });
    }
    // }
    // asyncGetMapById(id);
  };

  store.displayAllMaps = async () => {
    const allMaps = await getAllMaps();
    storeReducer({
      type: GlobalStoreActionType.SET_DISPLAYED_MAPS,
      payload: allMaps.data.data,
    });
  };

  store.displayAllUserMaps = async (userid) => {
    const allMaps = await getAllMapsByUserId(userid);
    storeReducer({
      type: GlobalStoreActionType.SET_DISPLAYED_MAPS,
      payload: allMaps.data.data,
    });
  };

  store.setDisplayedMaps = (maps) => {
    storeReducer({
      type: GlobalStoreActionType.SET_DISPLAYED_MAPS,
      payload: maps,
    });
  };

  store.setSelectedFeatures = (features) => {
    storeReducer({
      type: GlobalStoreActionType.SET_SELECTED_FEATURES,
      payload: features,
    });
  };

  store.addEditMapTransaction = (oldMap, newMap) => {
    let delta = jsondiffpatch.diff(oldMap, newMap);
    let transaction = new EditMap_Transaction(store, delta);
    tps.addTransaction(transaction);
  };

  store.undo = function () {
    tps.undoTransaction();
    store.setCurrentMap(store.currentMap);
  };
  store.redo = function () {
    tps.doTransaction();
    store.setCurrentMap(store.currentMap);
  };

  store.setSearchTerm = (term) => {
    storeReducer({
      type: GlobalStoreActionType.SET_SEARCH_TERM,
      payload: term,
    });
  };

  store.setSearchTags = (tags) => {
    storeReducer({
      type: GlobalStoreActionType.SET_SEARCH_TAGS,
      payload: tags,
    });
  };

  store.setSortType = (type) => {
    storeReducer({
      type: GlobalStoreActionType.SET_SORT_TYPE,
      payload: type,
    });
  };

  store.setCurrentLegend = (legend) => {
    storeReducer({
      type: GlobalStoreActionType.SET_CURR_LEGEND,
      payload: legend,
    });
  };

  store.getCurrentMap = () => {
    return store.currentMap;
  };

  store.setMapUpdates = (num) => {
    storeReducer({
      type: GlobalStoreActionType.SET_MAP_UPDATES,
      payload: num,
    });
  };

  store.setSearchByValue = (val) => {
    storeReducer({
      type: GlobalStoreActionType.SET_SEARCH_BY_VALUE,
      payload: val,
    });
  };

  store.setSortByValue = (val) => {
    storeReducer({
      type: GlobalStoreActionType.SET_SORT_BY_VALUE,
      payload: val,
    });
  };

  store.setCurrentMapId = (id) => {
    storeReducer({
      type: GlobalStoreActionType.SET_CURR_MAP_ID,
      payload: id,
    });
  };

  store.setCanSelectFeatures = (val) => {
    storeReducer({
      type: GlobalStoreActionType.SET_CAN_SELECT_FEATURES,
      payload: val,
    });
  };

  return (
    <GlobalStoreContext.Provider
      value={{
        store,
      }}
    >
      {props.children}
    </GlobalStoreContext.Provider>
  );
}

export default GlobalStoreContext;
export { GlobalStoreContextProvider };
