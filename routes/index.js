var express = require('express');
var router = express.Router();
const db = require('../db');
var path = require('path');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.sendFile(path.join(__dirname, '../public/home.html'));
});

/* GET user page. */
router.get('/user', function (req, res, next) {
  res.sendFile(path.join(__dirname, '../public/user.html'));
});

/* GET explore page. */
router.get('/explore', function (req, res, next) {
  res.sendFile(path.join(__dirname, '../public/explore.html'));
});


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/public_reviews', async (req, res, next) => {
  try{
    const [rows] = await db.query('SELECT user_id FROM user_books WHERE book_id = ?',[req.query.book_id]);

    if(rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const seller_id = rows[0].user_id;

    const [reviews] = await db.query(
      `SELECT
         u.username AS reviewer_name,
         r.review_text,
         r.review_rating,
         r.review_at,
         b.book_title
       FROM reviews r
       JOIN bought_books b ON r.purchase_id = b.purchase_id
       JOIN users u ON b.user_id = u.id
       WHERE b.seller_id = ?`,
      [seller_id]);
    return res.send(reviews);
  }
  catch(error){
    console.log(error);
    return res.sendStatus(400);
  }
});


module.exports = router;
