import axios from 'axios'
axios.defaults.withCredentials = true;
const api = axios.create({
    baseURL: 'http://localhost:4000/',
})

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
