import axios from 'axios'
axios.defaults.withCredentials = true;

console.log('match', window.location.origin.includes(":3000"));
const dev = 'http://localhost:4000';
const baseURL = window.location.origin.includes(":3000") ? dev : window.location.origin;

const api = axios.create({
    //baseURL: 'http://localhost:4000/',
    baseURL: baseURL
});

// post request to register user
export const registerUser = (username, email, password, confirmPassword) => {
    return api.post(`/users`, {
        username : username,
        email : email,
        password : password,
        confirmPassword : confirmPassword
    }).catch(function(error){
        return error.response
    });
}

export const getAllUsers = () => {
    return api.get('/users')
        .catch((err) => {
            return err.response;
        });
}

const apis = {
    registerUser,
    getAllUsers
}

export default apis
