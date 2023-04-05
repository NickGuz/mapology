import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";


export const GlobalStoreContext = createContext({});

export const GlobalStoreActionType = {
    CHANGE_PAGE_VIEW: "CHANGE_PAGE_VIEW"
}

export const PageViewTypes = {
    HOME : "HOME",
    REGISTER : "REGISTER",
    
}

function GlobalStoreContextProvider(props) {
    const [store, setStore] = useState({
        pageView: PageViewTypes.HOME,
    });
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext);

    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            case GlobalStoreActionType.CHANGE_PAGE_VIEW:{
                return setStore({
                    pageView : payload
                })
            }
        }
    }
    store.changeView = function (view){
        storeReducer({
            type: GlobalStoreActionType.CHANGE_VIEW,
            payload: view
        });
    }

}
