import axios from 'axios'
axios.defaults.withCredentials = true;
const api = axios.create({
    baseURL: 'http://localhost:4000/auth',
})

// post request to register user
export const registerUser = (userName, email, password, confirmPassword) => {
    return api.post(`/register/`, {
        userName : userName,
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
