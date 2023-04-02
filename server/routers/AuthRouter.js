const AuthController = require('../controllers/AuthController.js');
const express = require('express');

const router = express();
// router.use(express.static(path.join(process.cwd() + "/build")));
// const port = process.env.PORT || 5000

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
router.put('/register', AuthController.register);
router.get('/register', AuthController.register);

// Handles a password change
// TODO
router.put('/changepass', AuthController.changePassword);

// Handles user deleting their account
// TODO
router.delete('/delete', AuthController.deleteUser);

// router.listen(port, () => {
//     console.log(`Server listening on port ${port}`);
// });
module.exports = router;
