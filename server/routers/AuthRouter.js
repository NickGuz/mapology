const AuthController = require('../controllers/AuthController.js');
const express = require('express');

const router = express.Router();

// Handles ask if user logged in request
// TODO
router.get('/loggedin', AuthController.loggedIn);

// Handles existing user login requests
// TODO
router.post('/login', AuthController.login);

// Handles logout user requests
// TODO
router.get('/logout', AuthController.logout);

// Handles new user registration requests
router.post('/register', AuthController.register);

// Handles get users
router.get('/users', AuthController.getAllUsers);

// Handles get a user by id
router.get('/user/:id', AuthController.getUserById);

// Handles a password change
// TODO
router.post('/changePassword', AuthController.changePassword);

// Handles user deleting their account
// TODO
router.delete('/delete', AuthController.deleteUser);

//Handles sending recovery email
router.post('/sendRecoveryEmail', AuthController.sendRecoveryEmail);

module.exports = router;
