const express = require('express');
const router = express.Router();

// eslint-disable-next-line consistent-return
router.get('/', async (req, res) => {
    try {
        const name = req.query.title;
        if (!name) {
            return res.status(400).json({ error: 'Title is required' });
        }

        const googleAPI = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(name)}`;

        const response = await fetch(googleAPI);
        const data = await response.json();

        res.json(data.items || []);

    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
});

// eslint-disable-next-line consistent-return
router.get('/autocomplete', async (req, res) => {
    try {
        const title = req.query.value;
        if (!title) {
            return res.status(400).json({ error: 'Value is required' });
        }

        const googleAPI = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(title)}`;

        const response = await fetch(googleAPI);
        const data = await response.json();

        res.json(data.items || []);

    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
});


module.exports = router;
