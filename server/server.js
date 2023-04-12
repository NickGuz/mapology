const express = require("express");
require("dotenv").config();
const cors = require("cors");
const db = require("./models/db");
const { User } = require("./sequelize");
const path = require('path');

const prod = 'https://mapology-1.herokuapp.com/';
const dev = 'http://localhost:3000'
const url = (process.env.NODE_ENV ? prod : dev);

const app = express();
app.use(express.json()); // parses incoming requests with JSON payloads
app.use(cors({ credentials: true, origin: url }));
app.use(express.static(path.join(process.cwd() + "/build")));

// List of all the files that should be served as-is
// const protectedFiles = ['transformed.js', 'main.js', 'main.css', 'favicon.ico'];

app.get('/users', async (req, res) => {
    const users = await User.findAll();
    res.json(users);
});

app.post('/users', async (req, res) => {
    const users = await User.create(req.body);
    res.json(users);
});

// app.get('*', (req, res) => {
//     let route = req.params['0'].substring(1);
//     console.log('req.params', req.params);
//
//     if (protectedFiles.includes(route)) {
//         // Return the actual file
//         res.sendFile(path.join(process.cwd(), 'build', route));
//     } else {
//         // Otherwise, redirect to /build/index.html
//         res.sendFile(path.join(process.cwd(), 'build', 'index.html'));
//     }
// });

// set port, listen for requests
const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

module.exports = server;
