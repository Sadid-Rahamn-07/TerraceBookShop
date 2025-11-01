var express = require('express');
var router = express.Router();
const db = require('../db');
var path = require('path');
const requireLogin = require('../middleware/auth');
const { features } = require('process');


/* GET home page. */
router.post('/add', requireLogin, async function (req, res, next) {
    try {
        const { book_id } = req.body;
        const [seller] = await db.query('SELECT user_id FROM user_books WHERE book_id = ?', [book_id]);
        const info = seller[0];

        const user_id = req.session.user.user_id;
        console.log("REQ BODY:", req.body);
        console.log("SESSION USER:", req.session.user);
        console.log("Resolved user_id:", user_id);
        await db.query(
            `INSERT INTO shopping_cart (user_id, seller_id, book_id) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE added_at = CURRENT_TIMESTAMP`,
            [
              user_id,
              info.user_id,
              book_id
            ]
              //if add multiple times, just update the time stamp
        );

        return res.sendStatus(200);
    }

    catch (error) {
        console.error(error);
            return res.sendStatus(400);

    }
});
router.get('/items', requireLogin, async function (req, res) {
  try {
    const user_id = req.session.user.user_id;

    const [rows] = await db.query(
      `SELECT ub.book_id, ub.user_id, ub.title, ub.author, ub.price, ub.book_condition, ub.imageFilename, ub.description FROM shopping_cart sc JOIN user_books ub ON sc.book_id = ub.book_id WHERE sc.user_id = ?`,
      [user_id]
    );

    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.sendStatus(500);
  }
});

module.exports = router;
