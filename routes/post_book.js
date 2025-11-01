const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../db'); // This uses mysql2().promise()
const requireLogin = require('../middleware/auth');
require('dotenv').config();

// Set storage engine for multer
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// Helper to delete uploaded file
function deleteUploadedFile(filename) {
    fs.unlink(path.join('uploads', filename), (err) => {
        if (err) console.error('Error deleting file:', err);
    });
}

// POST route to upload a book
router.post('/',requireLogin, upload.single('image'), async (req, res) => {
    if (!req.file) return res.status(400).send('No image uploaded');

    const { title, author, isbn, price, condition, description } = req.body;

    // Validate fields
    if (!title || !author || !isbn || !price || !condition || !description) {
        deleteUploadedFile(req.file.filename);
        return res.status(400).send('Missing required book details');
    }

    // Check if user is logged in
    const username = req.session?.user?.username;
    // if (!username) {
    //     deleteUploadedFile(req.file.filename);
    //     return res.status(401).send('User not logged in');
    // }

    try {
        // Get user ID from database
        const [userResults] = await db.query('SELECT id FROM users WHERE username = ?', [username]);

        if (userResults.length === 0) {
            deleteUploadedFile(req.file.filename);
            return res.status(404).send('User not found');
        }

        const user_id = userResults[0].id;
        const imageFilename = req.file.filename;

        // Insert book into user_books table
        const insertSQL = `
            INSERT INTO user_books (user_id, title, author, isbn, price, book_condition, description, imageFilename)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        await db.query(insertSQL, [user_id, title, author, isbn, price, condition, description, imageFilename]);

        res.send('Book added successfully!');
    } catch (err) {
        console.error('Server error:', err);
        deleteUploadedFile(req.file.filename);
        res.status(500).send('Server error while saving the book');
    }
});

module.exports = router;
