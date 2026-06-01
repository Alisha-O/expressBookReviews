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


// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.session.username;

    // Check if user is logged in
    if (!username) {
        return res.status(401).json({ message: "User not logged in" });
    }

    // Check if review is provided
    if (!review) {
        return res.status(400).json({ message: "Review is required" });
    }

    // Check if book exists
    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    // Initialize reviews object if not present
    if (!books[isbn].reviews) {
        books[isbn].reviews = {};
    }

    // Add or update review (keyed by username)
    books[isbn].reviews[username] = review;

    return res.status(200).json({
        message: "Review added/updated successfully",
        reviews: books[isbn].reviews
    });
});


regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.username;

    // Check login
    if (!username) {
        return res.status(401).json({ message: "User not logged in" });
    }

    // Check book exists
    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    // Check reviews exist
    if (!books[isbn].reviews) {
        return res.status(404).json({ message: "No reviews found" });
    }

    // Delete only this user's review
    if (books[isbn].reviews[username]) {
        delete books[isbn].reviews[username];
        return res.status(200).json({
            message: "Review deleted successfully",
            reviews: books[isbn].reviews
        });
    } else {
        return res.status(404).json({
            message: "No review found for this user"
        });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
