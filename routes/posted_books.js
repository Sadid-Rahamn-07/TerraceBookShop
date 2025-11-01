const express = require('express');
const router = express.Router();
const db = require('../db'); // mysql2().promise() connection
const requireLogin = require('../middleware/auth');
require('dotenv').config();

router.get('/',requireLogin, async (req, res) => {
    try {
        const username = req.session?.user?.username;
        console.log('Fetching books for user:', req.session?.user?.username);
        if (!username) {
            return res.status(401).json({ error: 'User not logged in' });
        }

        // Get the user's ID
        const [userResults] = await db.query(
            'SELECT id FROM users WHERE username = ?',
            [username]
        );

        if (userResults.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user_id = userResults[0].id;

        // Fetch posted books for the user
        const [books] = await db.query(
            'SELECT title, author, isbn, price, book_condition, imageFilename, description FROM user_books WHERE user_id = ?',
            [user_id]
        );
        res.status(200).json(books); // Be explicit with status 200
    } catch (error) {
        console.error('Error fetching posted books:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/search', requireLogin, async (req, res) => {
    const username = req.session?.user?.username;
    // if (!username) {
    //     return res.status(401).json({ error: 'User not logged in' });
    // }

    // Get the user's ID
    const [userResults] = await db.query(
        'SELECT id FROM users WHERE username = ?',
        [username]
    );

    if (userResults.length === 0) {
        return res.status(404).json({ error: 'User not found' });
    }

    const user_id = userResults[0].id;
    const searchTerm = req.query.q ? req.query.q.trim() : '';

    if (!searchTerm) {
        return res.json([]);
    }

    const sql = 'SELECT * FROM user_books WHERE user_id = ? AND (title LIKE ? OR author LIKE ?)';
    const values = [user_id, `%${searchTerm}%`, `%${searchTerm}%`];

    try {
        const [results] = await db.query(sql, values);
        res.status(200).json(results);
    } catch (err) {
        // eslint-disable-next-line no-console
        console.error('DB error:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

router.get('/autocomplete',requireLogin, async (req, res) => {
    const username = req.session?.user?.username;
    // if (!username) {
    //     return res.status(401).json({ error: 'User not logged in' });
    // }

    // Get the user's ID
    const [userResults] = await db.query(
        'SELECT id FROM users WHERE username = ?',
        [username]
    );

    if (userResults.length === 0) {
        return res.status(404).json({ error: 'User not found' });
    }

    const user_id = userResults[0].id;
    const searchTerm = req.query.q ? req.query.q.trim() : '';

    if (!searchTerm) {
        return res.json([]);
    }

    const sql = `
        SELECT title, author
        FROM user_books
        WHERE user_id = ? AND (title LIKE ? OR author LIKE ?)
        ORDER BY title ASC
        LIMIT 10
    `;
    const values = [user_id, `%${searchTerm}%`, `%${searchTerm}%`];

    try {
        const [results] = await db.query(sql, values);
        res.json(results);
    } catch (err) {
        // eslint-disable-next-line no-console
        console.error('DB error:', err);
        res.status(500).json({ error: 'Database error' });
    }
});


module.exports = router;
