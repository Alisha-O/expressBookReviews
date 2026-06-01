const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
const SECRET_KEY = "library_secret_key";

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}


regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check input
    if (!username || !password) {
        return res.status(400).json({
            message: "Username and password are required"
        });
    }

    // Find user
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
        return res.status(401).json({
            message: "Invalid username or password"
        });
    }

    // Generate JWT token
    const token = jwt.sign(
        { username: username },
        SECRET_KEY,
        { expiresIn: "1h" }
    );

    return res.status(200).json({
        message: "Login successful",
        token: token
    });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
