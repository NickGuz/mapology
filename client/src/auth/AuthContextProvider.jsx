import React, { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./auth-request-api/AuthRequestApi";

export const AuthContext = createContext({});

const AuthActionType = {
REGISTER_USER: "REGISTER_USER",
GET_ALL_USERS: "GET_ALL_USERS",
OPEN_LOGIN_DIALOG: "OPEN_LOGIN_DIALOG",
CLOSE_LOGIN_DIALOG: "CLOSE_LOGIN_DIALOG",
};

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
	loginDialogOpen: false,
	invalidEmail: false,
});
const navigate = useNavigate();

const authReducer = (action) => {
	const { type, payload } = action;
	switch (type) {
	case AuthActionType.REGISTER_USER: {
		return setAuth({
		...auth,
		user: payload.user,
		acctEmpt: false,
		shortPass: false,
		notSamePass: false,
		registered: false,
		guest: false,
		});
	}
	case AuthActionType.REGISTER_USER_FAIL: {
		return setAuth({
		...auth,
		user: payload.user,
		acctEmpt: payload.acctEmpt,
		shortPass: payload.shortPass,
		notSamePass: payload.notSamePass,
		registered: payload.registered,
		invalidEmail: payload.invalidEmail,
		});
	}
	case AuthActionType.OPEN_LOGIN_DIALOG: {
		return setAuth({
		...auth,
		loginDialogOpen: true,
		});
	}
	case AuthActionType.CLOSE_LOGIN_DIALOG: {
		return setAuth({
		...auth,
		loginDialogOpen: false,
		});
	}
	default:
		return auth;
	}
};

auth.openLoginDialog = () => {
	authReducer({
	type: AuthActionType.OPEN_LOGIN_DIALOG,
	});
};

auth.closeLoginDialog = () => {
	authReducer({
	type: AuthActionType.CLOSE_LOGIN_DIALOG,
	});
};

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
};
auth.loginUser = async function(userInfo, password){
	console.log("getting")
	const response = await api.loginUser(userInfo,password);
	console.log(response)
	
};

auth.registerUser = async function(username, email, password, confirmPassword) {
	const response = await api.registerUser(username, email, password, confirmPassword);
	console.log("response", response);

	if (response.status === 200) {
	authReducer({
		type: AuthActionType.REGISTER_USER,
		payload: {
		user: response.data,
		},
	});
	navigate("/");
	} else if (response.status === 400) {
	authReducer({
		type: AuthActionType.REGISTER_USER_FAIL,
		payload: {
		acctEmpt: true,
		shortPass: false,
		notSamePass: false,
		registered: false,
		invalidEmail: false,
		},
	});
	console.log("empty account info");
	} else if (response.status === 401) {
	authReducer({
		type: AuthActionType.REGISTER_USER_FAIL,
		payload: {
		acctEmpt: false,
		shortPass: true,
		notSamePass: false,
		registered: false,
		invalidEmail: false,
		},
	});
	console.log("password too short");
	} else if (response.status === 402) {
	authReducer({
		type: AuthActionType.REGISTER_USER_FAIL,
		payload: {
		acctEmpt: false,
		shortPass: false,
		notSamePass: true,
		registered: false,
		invalidEmail: false,
		},
	});
	console.log("not the same password");
	} else if (response.status === 403) {
	authReducer({
		type: AuthActionType.REGISTER_USER_FAIL,
		payload: {
		acctEmpt: false,
		shortPass: false,
		notSamePass: false,
		registered: true,
		invalidEmail: false,
		},
	});
	console.log("already registered");
	} else if (response.status === 404) {
	authReducer({
		type: AuthActionType.REGISTER_USER_FAIL,
		payload: {
		acctEmpt: false,
		shortPass: false,
		notSamePass: false,
		registered: false,
		invalidEmail: true,
		},
	});
	console.log("invalid email");
	}
};

return (
	<AuthContext.Provider
	value={{
		auth,
	}}
	>
	{props.children}
	</AuthContext.Provider>
);
}

export default AuthContext;
export { AuthContextProvider };
