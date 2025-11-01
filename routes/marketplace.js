const express = require('express');
const router = express.Router();
const db = require('../db'); // Import the database connection

router.get('/', async (req, res) => {
    const sql = 'SELECT * FROM user_books';
    try {
        const [results] = await db.query(sql);
        res.json(results);
    } catch (err) {
        // eslint-disable-next-line no-console
        console.error('DB error:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

// eslint-disable-next-line consistent-return
router.get('/search', async (req, res) => {
    const searchTerm = req.query.q ? req.query.q.trim() : '';

    if (!searchTerm) {
        return res.json([]);
    }

    const sql = 'SELECT * FROM user_books WHERE title LIKE ? OR author LIKE ?';
    const values = [`%${searchTerm}%`, `%${searchTerm}%`];

    try {
        const [results] = await db.query(sql, values);
        res.json(results);
    } catch (err) {
        // eslint-disable-next-line no-console
        console.error('DB error:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

// eslint-disable-next-line consistent-return
router.get('/autocomplete', async (req, res) => {
    const searchTerm = req.query.q ? req.query.q.trim() : '';

    if (!searchTerm) {
        return res.json([]);
    }

    const sql = `
        SELECT title, author
        FROM user_books
        WHERE title LIKE ? OR author LIKE ?
        ORDER BY title ASC
        LIMIT 10
    `;
    const values = [`%${searchTerm}%`, `%${searchTerm}%`];

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
