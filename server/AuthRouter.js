import * as AuthController from './AuthController.js';
import express from 'express';

const router = express();
const port = 8000;

// Handles ask if user logged in request
// TODO
router.get('/loggedin', AuthController.loggedIn);

// Handles existing user login requests
// TODO
router.post('/login', AuthController.login);

// Handles logout user requests
// TODO
router.post('/logout', AuthController.logout);

// Handles new user registration requests
// TODO
router.post('/register', AuthController.register);

// Handles a password change
// TODO
router.put('/changepass', AuthController.changePassword);

// Handles user deleting their account
// TODO
router.delete('/delete', AuthController.deleteUser);

router.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});