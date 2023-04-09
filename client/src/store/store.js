import { createContext, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import AuthContext from "../auth/AuthContextProvider";


export const GlobalStoreContext = createContext({});

export const GlobalStoreActionType = {
    CHANGE_PAGE_VIEW: "CHANGE_PAGE_VIEW",
    SET_OPEN_IMPORT_DIALOG: "SET_OPEN_IMPORT_DIALOG",
    SET_EDIT_ATTRIBUTE: "SET_EDIT_ATTRIBUTE",
}

export const PageViewTypes = {
    HOME : "HOME",
    REGISTER : "REGISTER",
}

function GlobalStoreContextProvider(props) {
    const [store, setStore] = useState({
        pageView: PageViewTypes.HOME,
        importDialogOpen: false,
        editingAttributes: false,
    });

    // const navigate = useNavigate();
    // const { auth } = useContext(AuthContext);

    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            case GlobalStoreActionType.CHANGE_PAGE_VIEW:{
                return setStore({
                    ...store,
                    pageView : payload
                })
            }
            case GlobalStoreActionType.SET_OPEN_IMPORT_DIALOG: {
                return setStore({
                    ...store,
                    importDialogOpen: payload
                });
            }
            case GlobalStoreActionType.SET_EDIT_ATTRIBUTE: {
                return setStore({
                    ...store,
                    editingAttributes: payload
                    

                });
            }
            default: {
                return store;
            }
        }
    }

    store.setOpenImportDialog = (open) => {
        storeReducer({
            type: GlobalStoreActionType.SET_OPEN_IMPORT_DIALOG,
            payload: open
        });
    } 

    store.setEditAttribute = (edit) => {
        console.log(store.editingAttributes)
        storeReducer({
            type: GlobalStoreActionType.SET_EDIT_ATTRIBUTE,
            payload: edit
        });
    }

    store.changeView = function (view){
        storeReducer({
            type: GlobalStoreActionType.CHANGE_VIEW,
            payload: view
        });
    }

    return (
        <GlobalStoreContext.Provider value={{
            store
        }}>
            {props.children}
        </GlobalStoreContext.Provider>
    )

}

export default GlobalStoreContext;
export { GlobalStoreContextProvider };
