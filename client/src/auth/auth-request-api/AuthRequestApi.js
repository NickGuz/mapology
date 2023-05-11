import axios from "axios";
axios.defaults.withCredentials = true;

const dev = "http://localhost:4000";
const baseURL = window.location.origin.includes(":3000") ? dev : window.location.origin;

const api = axios.create({
  baseURL: baseURL,
});

export const getLoggedIn = async () =>  {
  return await api.get(`/auth/loggedIn/`);
}

export const loginUser = (userInfo, password) => {
  return api
    .post("/auth/login", {
      userInfo: userInfo,
      password: password,
    })
    .catch(function(error) {
      return error.response;
    });
};

export const logoutUser = () => api.get(`/auth/logout/`);

// post request to register user
export const registerUser = (username, email, password, confirmPassword) => {
  return api
    .post(`/auth/register`, {
      username: username,
      email: email,
      password: password,
      confirmPassword: confirmPassword,
    })
    .catch(function(error) {
      return error.response;
    });
};

export const getAllUsers = () => {
  return api.get("/auth/users").catch((err) => {
    return err.response;
  });
};

export const getUserById = (id) => {
  return api.get(`/auth/user/${id}`).catch((err) => {
    return err.response;
  });
};

export const sendRecoveryEmail = (email) => {
  return api
  .post(`/auth/sendRecoveryEmail`, {
    email: email,
  })
  .catch(function(error) {
    return error.response;
  });
};

const apis = {
  registerUser,
  getAllUsers,
  getUserById,
  loginUser,
  logoutUser,
  getLoggedIn,
  sendRecoveryEmail,
};

export default apis;
