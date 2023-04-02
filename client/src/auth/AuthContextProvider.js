import React, { createContext, useState } from "react";
import {useNavigate} from 'react-router-dom';
import api from './auth-request-api/AuthRequestApi'

export const AuthContext = createContext({});

const AuthActionType = {
    REGISTER_USER: "REGISTER_USER",
    GET_ALL_USERS: "GET_ALL_USERS"
}

function AuthContextProvider(props) {
    const [auth, setAuth] = useState({
        user: null,
        guest: false,
        loggedIn: false,
        incorrectInfo: false,
        emptyInfo: false,
        acctEmpt: false,
        shortPass: false,
        notSamePass: false,
        registered: false,
    });
    const navigate = useNavigate();


    const authReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            
            case AuthActionType.REGISTER_USER: {
                return setAuth({
                    user: payload.user,
                    acctEmpt: false,
                    shortPass: false,
                    notSamePass: false,
                    registered: false,
                    guest: false,
                })
            }
            case AuthActionType.REGISTER_USER_FAIL: {
                return setAuth({
                    user: payload.user,
                    acctEmpt: payload.acctEmpt,
                    shortPass: payload.shortPass,
                    notSamePass: payload.notSamePass,
                    registered: payload.registered,
                    guest: false,
                })
            }
            default:
                return auth;
        }
    }
   
    auth.getAllUsers = async function() {
        const response = await api.getAllUsers();
        console.log(response);
        return response;

        // if (response.status === 200) {
        //     authReducer({
        //         type: AuthActionType.GET_ALL_USERS,
        //         payload: {
        //             users: response.data.users
        //         }
        //     });
        //     navigate("/");
        // }
    }


    auth.registerUser = async function(username, email, password, confirmPassword) {
        const response = await api.registerUser(username, email, password, confirmPassword );      
        
        if (response.status === 200) {
            authReducer({
                type: AuthActionType.REGISTER_USER,
                payload: {
                    user: response.data.user
                }
            });
            navigate("/");
        }
        
        else if (response.status === 400){
            authReducer({
                type: AuthActionType.REGISTER_USER_FAIL,
                payload: {
                    acctEmpt: true,
                    shortPass: false,
                    notSamePass: false,
                    registered: false,
                }
            });
            console.log("empty account info");
        }
        else if (response.status === 401){
            authReducer({
                type: AuthActionType.REGISTER_USER_FAIL,
                payload: {
                    acctEmpt: false,
                    shortPass: true,
                    notSamePass: false,
                    registered: false,
                }
            });
            console.log("password too short");
        }
        else if (response.status === 402){
            authReducer({
                type: AuthActionType.REGISTER_USER_FAIL,
                payload: {
                    acctEmpt: false,
                    shortPass: false,
                    notSamePass: true,
                    registered: false,
                }
            });
            console.log("not the same password");
        }
        else if (response.status === 403){
            authReducer({
                type: AuthActionType.REGISTER_USER_FAIL,
                payload: {
                    acctEmpt: false,
                    shortPass: false,
                    notSamePass: false,
                    registered: true,
                }
            });
            console.log("already registered");
        }
       
    }

    return (
        <AuthContext.Provider value={{
            auth
        }}>
            {props.children}
        </AuthContext.Provider>
    );
}

export default AuthContext;
export { AuthContextProvider };