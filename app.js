const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const multer = require('multer');
const requireAdmin = require('./middleware/isadmin');


const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const searchRouter = require('./routes/search');
const post_book = require('./routes/post_book');
const marketplace = require('./routes/marketplace');
const posted_books = require('./routes/posted_books');
const cart= require('./routes/cart');
const admin= require('./routes/admin');
const dataExport= require('./routes/export');

const requireLogin = require('./middleware/auth');


const app = express();


/* ────────────────── core middleware ────────────────── */
app.use(logger('dev'));
app.use(express.json());                           // parses application/json
app.use(express.urlencoded({ extended: true }));   // parses x-www-form-urlencoded
app.use(cookieParser());
app.use(session({
  name: 'user.sid',
  secret: 'Group85',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 6000,
            httpOnly: true,
            rolling: true //reset cookie maxage on every response
   }
}));
app.get('/account.html', requireLogin, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'account.html'));
});
app.get('/wishlist.html', requireLogin, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'wishlist.html'));
});
app.get('/shopping_cart.html', requireLogin, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'shopping_cart.html'));
});
app.get('/MyPurchase.html', requireLogin, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'MyPurchase.html'));
});
app.get('/admin.html', requireAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});
/* ────────────────── static files ───────────────────── */
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

/* ────────────────── view engine (only for error page) */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

/* ────────────────── routes ─────────────────────────── */
app.use('/', indexRouter);    // home & other pages
app.use('/users', usersRouter);    // <<<  /users/reg  is here
app.use('/search', searchRouter);   // search endpoints
app.use('/post_book', post_book); // post book endpoint
app.use('/marketplace', marketplace); // marketplace endpoint
app.use('/posted_books', posted_books); // posted books endpoint
app.use('/cart', requireLogin, cart);
app.use('/admin', requireAdmin, admin);
app.use('/export', dataExport);
app.get('/get/username', (req, res) => {
  res.json({ username: req.session.user?.username ?? null });
});

/* ────────────────── 404 catcher  (keep this LAST) ──── */
app.use((req, res, next) => {
  next(createError(404));
});

/* ────────────────── generic error renderer ─────────── */
app.use((err, req, res, next) => {
  res.locals.title = 'Error';
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
