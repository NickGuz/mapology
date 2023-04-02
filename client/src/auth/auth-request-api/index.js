import axios from 'axios'
axios.defaults.withCredentials = true;
const api = axios.create({
    baseURL: 'http://localhost:4000/',
})

// post request to register user
export const registerUser = (username, email, password, confirmPassword) => {
    return api.post(`/register`, {
        username : username,
        email : email,
        password : password,
        confirmPassword : confirmPassword
    }).catch(function(error){
        return error.response
    });
}
const apis = {
    registerUser,
}

export default apis
