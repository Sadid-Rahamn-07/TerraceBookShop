var express = require('express');
var router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');
const requireLogin = require('../middleware/auth');
const upload_profile_image = require('../middleware/profile_photo');

// const fs = require('fs')
// const multer = require('multer');
const path = require('path');
const { send } = require('process');

router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/login', async function (req, res, next) {

  const { username, password } = req.body; //take the username, email, and passwrod fields from the object req.body and create local variables with the same names."

  try {
    const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);

    if (rows.length === 0) {
      return res.status(404).send('User not found');
    }

    const user = rows[0];
    const password_hash = await bcrypt.compare(password, user.password);
    if (password_hash) {
      await db.query('UPDATE users SET last_login_time = CURRENT_TIMESTAMP WHERE username = ?', [user.username]);


      req.session.user = {username: user.username, user_id: user.id, is_admin: user.is_admin};


      return res.status(200).send('Login successful!');
    }
    return res.status(401).send('Incorrect password');

  } catch (err) {
    return res.status(500).send('Internal server error');
  }
});

router.post('/reg', async function (req, res, next) {
  const { username, email, password } = req.body;
  if (username && email && password) {
    try {
      const dir = '/images/user_profile_photos/Default.jpg';

      const hashedPW = await bcrypt.hash(password, 10);
      const [result] = await db.query('INSERT INTO users (username,email,password,profile_image) VALUES (?,?,?,?)', [username, email, hashedPW,dir]);
      req.session.user = {
        username: username,
        user_id: result.insertId
      };

      return res.status(201).send('New user is created');
    }
    catch (err) {
       console.error(err);
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).send('User already exist');
      }

      return res.status(500).send('Internal server error');
    }
  }
  else {
    return res.status(400).send('Missing required fields');
  }
});

router.get('/userinformation', requireLogin, async function (req, res, next) {
  try {

    const userid = req.session.user.user_id;
    const [row] = await db.query('SELECT username, address, email, phone_number, gender, dateofBirth, profile_image from users WHERE id = ?', [userid]);
    if (row.length === 0) {
      return res.status(404).json({ error: 'User not found' });    }
    console.log(row[0]);
    return res.status(200).json(row[0]);
  }
  catch (err) {
    console.error(err);
        return res.status(500).json({ error: 'Internal server error' });

  }
});

router.get('/profileImage', requireLogin, async function (req, res, next) {
  try {
    const userid = req.session.user.user_id;
    const [row] = await db.query('SELECT profile_image from users WHERE id = ?', [userid]);
    if (row.length === 0) {
      return res.sendStatus(404);
    }
    // console.log(row[0]);
    return res.status(200).json(row[0]);
  }
  catch (err) {
    console.error(err);
    return res.status(500);
  }
});


router.put('/informationUpdate', requireLogin, upload_profile_image.single('profile_photo'), async function (req, res, next) {
  console.log('PUT /informationUpdate called');
  const userId = req.session.user.user_id;
  const { name, address, email, phone, gender, dateofbirth } = req.body;
  const uploadedFile = req.file;
  try {
    const updateFields = [name, address, email, phone, gender, dateofbirth];
    let sql = `UPDATE users SET username = ?,address = ?,email = ?,phone_number = ?,gender = ?, dateofBirth = ?`;
    if (uploadedFile) {
      const filename = uploadedFile.filename;
      const relativePath = `/images/user_profile_photos/${filename}`;
      sql += `, profile_image = ?`;
      updateFields.push(relativePath);
    }
    sql += ` WHERE id = ?`;
    updateFields.push(userId);
    const [result] = await db.query(sql, updateFields);
    if (result.affectedRows === 0) {
      return res.sendStatus(404);
    }
    return res.sendStatus(200);
  }
catch (err) {
    console.error(err);
    if (err.code === 'ER_TRUNCATED_WRONG_VALUE') {
      return res.status(400).send('Invalid input value');
    }
    return res.status(500).send('Internal server error');
  }
});

router.post('/logout', function (req, res) {
  req.session.destroy(function (err) {
    if (err) {
      return res.sendStatus(500);
    }
    res.clearCookie('user.sid');
    res.sendStatus(200);
  });
});

router.post('/wishlist_add',requireLogin, async (req, res, next) => {
  const { booktitle, authorname, image, bookid } = req.body;
  try{
    /*Getting the user_id from the users table with the respective session cookies*/
    const userInfo = req.session.user;
    if(!userInfo){ return res.status(401).send('user is not logged in'); }
    const [rows] = await db.query('SELECT id FROM users WHERE id = ?', [userInfo.user_id]);
    const user_id = rows[0].id;
    /*The process end here*/

    await db.query('INSERT INTO wishlist (user_id, external_book_id, book_title, author_name, thumbnail_url) VALUES (?,?,?,?,?)',[user_id, bookid, booktitle, authorname, image]);
    return res.sendStatus(200);
  }
  catch(error){
    console.log(error);
    return res.sendStatus(400);
  }
});

router.post('/wishlist_delete',requireLogin, async(req, res, next) => {
  const { bookid } = req.body;
  try{
    const userInfo = req.session.user;
    if(!userInfo){ return res.status(401).send('user is not logged in'); }

    await db.query('DELETE FROM wishlist WHERE user_id = ? AND external_book_id = ?', [userInfo.user_id, bookid]);
  }
  catch(error){
    console.log(error);
    return res.sendStatus(400);
  }
});

router.get('/wishlist_show', requireLogin, async (req, res, next) =>{
  try{
    const userInfo = req.session.user;
    if(!userInfo){ return res.status(401).send('User is not logged in'); }
    const [rows] = await db.query('SELECT thumbnail_url, book_title, author_name, external_book_id FROM wishlist WHERE user_id = ?', [userInfo.user_id]);
    return res.send(rows);
  }
  catch(error){
    console.log(error);
    return res.sendStatus(400);
  }
});

router.get('/local_books', async (req, res, next) =>{
  try{
    const [rows] = await db.query('SELECT user_id, book_condition, title, author, price, imageFilename, description, created_at FROM user_books WHERE book_id = ?',[req.query.book_id]);

    if(rows.length === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }

    const book = rows[0];

    const [sellerRows] = await db.query('SELECT username FROM users WHERE id = ?', [book.user_id]);

    book.seller_name = sellerRows[0]?.username || 'Unknown';

    return res.send(book);
  }
  catch(error){
    console.log(error);
    return res.sendStatus(400);
  }
});

router.post('/purchase', requireLogin, async(req, res, next) =>{
  try{
    const userInfo = req.session.user;
    if(!userInfo){ return res.status(401).send('User is not logged in'); }

    const { bookIDs } = req.body;

    for(const id of bookIDs){
      const [book] = await db.query(
        'SELECT title, user_id, author, isbn, price, user_id, book_condition, imageFilename, description FROM user_books WHERE book_id = ?',
        [id]
      );

      const info = book[0];

      await db.query(
        `INSERT INTO bought_books
         (user_id, seller_id, book_title, author_name, price, image, book_condition)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          userInfo.user_id,
          info.user_id,
          info.title,
          info.author,
          info.price,
          info.imageFilename,
          info.book_condition
        ]
      );

      await db.query(
        'DELETE FROM user_books WHERE book_id = ?',
        [id]
      );
      await db.query(
        'DELETE FROM shopping_cart WHERE book_id = ?',
        [id]
      );

    }
    res.status(200).send('Books purchased successfully');
  }
  catch (err) {
    console.log(err);
    console.error('Error purchasing books:', err);
    next(err);
  }
});

router.post('/delete_cart', requireLogin, async(req, res, next) =>{
  try{
  const {book_id} = req.body;
  await db.query('DELETE FROM shopping_cart WHERE book_id = ?',[book_id])
  res.sendStatus(200);

}
  catch (err) {
    console.log(err);
    console.error('cannnot delete from cart:', err);
    res.status(500).send('Server error');

    next(err);
  }

})

router.get('/show_purchase', async (req, res, next) => {
  try{
    const userInfo = req.session.user;
    if(!userInfo){ return res.status(401).send('User is not logged in'); }

    const [rows] = await db.query(
      `SELECT
        b.book_title,
        b.purchase_id,
        u.username AS seller_name,
        b.author_name,
        b.price,
        b.image,
        b.book_condition,
        b.purchased_time
      FROM bought_books b
      JOIN users u ON b.seller_id = u.id
      WHERE b.user_id = ?`,
      [userInfo.user_id]
    );

    return res.send(rows);
  }
  catch(error){
    console.log(error);
    return res.sendStatus(400);
  }
});

router.post('/post_reviews',requireLogin, async(req, res, next) => {
  try{
    const userInfo = req.session.user;
    if(!userInfo){ return res.status(401).send('User is not logged in'); }

    const { purchaseID, review_string, ratings } = req.body;

    await db.query(
      `INSERT INTO reviews
      (purchase_id, review_text, review_rating)
      VALUES (?, ?, ?)`,
      [purchaseID, review_string, ratings]
    );

    res.status(200);
  }
  catch(error){
    console.log(error);
    console.err('Error uploading reviews', error);
    next(error);
  }
});

router.get('/get_reviews', requireLogin, async(req, res, next) => {
  try{
    const userInfo = req.session.user;
    if(!userInfo){ return res.status(401).send('User is not logged in'); }


    const [reviews] = await db.query(
        `SELECT r.purchase_id, r.review_text, r.review_rating
        FROM reviews r
        JOIN bought_books b ON r.purchase_id = b.purchase_id
        WHERE b.user_id = ?`,
        [userInfo.user_id]
    );

    return res.send(reviews);
  }
  catch(error){
    console.log(error);
    console.err('Error getting reviews', error);
    next(error);
  }
});

module.exports = router;
