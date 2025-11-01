var express = require('express');
var router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');

router.get('/show_users', async (req, res, next) => {
    try{
        const [users] = await db.query(
            `SELECT * FROM users`
        );

        return res.send(users);
    }
    catch(error){
        console.log(error);
        console.err('Error getting the users for admin', error);
    }
});

router.post('/delete_user', async(req, res, next) =>{
    try{
        const { userId } = req.body;

        await db.query(`DELETE FROM users WHERE id = ?`, [userId]);
        const [users] = await db.query(`SELECT * FROM users`);

        return res.send(users);
    }
    catch(error){
        console.log(error);
        console.err('Error in deleting user', error);
    }
});

router.post('/update_user', async (req, res) => {
    const {
        id, username, email, phone_number,
        address, gender, dateofbirth
    } = req.body;

    try{
        await db.query(
        `
            UPDATE users
            SET
                username = ?,
                email = ?,
                phone_number = ?,
                address = ?,
                gender = ?,
                dateofbirth = ?
            WHERE id = ?
        `,
            [username, email, phone_number, address, gender, dateofbirth, id]);


        const [rows] = await db.query(
        `SELECT id, username, email, phone_number, address, gender, dateofbirth, profile_image
            FROM users
            WHERE id = ?`,
        [id]
        );

        return res.json(rows[0]);
    }
    catch (error) {
        console.log(error);
        console.err('Error in updating user', error);
  }
});

router.post('/reset_avatar', async (req, res) => {
    const { id } = req.body;
    const default_photo = '/images/user_profile_photos/Default.jpg';

    try {
        await db.query(
        `
            UPDATE users
            SET profile_image = ?
            WHERE id = ?
        `,
            [default_photo, id]);

        const [users] = await db.query(
            `SELECT * FROM users WHERE id = ?`,
            [id]
        );

        return res.json(users);
    }
    catch (error){
        console.log(error);
        console.err('Error in deleting profile photo', error);
    }
});

router.post('/add_user', async (req,res) => {
    const { username, email, password } = req.body;
    try{
        const hashedPW = await bcrypt.hash(password, 10);
        const defaultPhoto = '/images/user_profile_photos/Default.jpg';

        const [result] = await db.query(
        'INSERT INTO users (username, email, password, profile_image) VALUES (?, ?, ?, ?)',
        [username, email, hashedPW, defaultPhoto]
        );

        const [newUserRows] = await db.query(
        'SELECT id, username, email, phone_number, address, gender, dateofbirth, profile_image FROM users WHERE id = ?',
        [result.insertId]
        );
        return res.status(201).json(newUserRows[0]);
    }
    catch (error){
        console.log(error);
        console.err('Error in deleting profile photo', error);
    }
});


module.exports = router;
