import { createContext, useState } from "react";
import { getMapById, getAllMaps } from "./GlobalStoreHttpRequestApi";
// import { useNavigate } from "react-router-dom";
// import AuthContext from "../auth/AuthContextProvider";

export const GlobalStoreContext = createContext({});

export const GlobalStoreActionType = {
  CHANGE_PAGE_VIEW: "CHANGE_PAGE_VIEW",
  SET_OPEN_IMPORT_DIALOG: "SET_OPEN_IMPORT_DIALOG",
  SET_OPEN_SETTINGS_MODAL: "SET_OPEN_SETTINGS_MODAL",
  CURR_MAP: "CURR_MAP",
  SET_DISPLAYED_MAPS: "SET_DISPLAYED_MAPS",
};

export const PageViewTypes = {
  HOME: "HOME",
  REGISTER: "REGISTER",
};

function GlobalStoreContextProvider(props) {
  const [store, setStore] = useState({
    pageView: PageViewTypes.HOME,
    importDialogOpen: false,
    settingsModalOpen: false,
    currentMap: null,
    displayedMaps: [],
  });

  // const navigate = useNavigate();
  // const { auth } = useContext(AuthContext);

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
        });
      }
      case GlobalStoreActionType.SET_DISPLAYED_MAPS: {
        return setStore({
          ...store,
          displayedMaps: payload,
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

  store.getMapById = (id) => {
    async function asyncGetMapById(id) {
      let response = await getMapById(id);
      if (response.status == 200) {
        let map = response.data.data;
        storeReducer({
          type: GlobalStoreActionType.CURR_MAP,
          payload: map,
        });
      }
    }
    asyncGetMapById(id);
  };

  store.displayAllMaps = async () => {
    const allMaps = await getAllMaps();
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
