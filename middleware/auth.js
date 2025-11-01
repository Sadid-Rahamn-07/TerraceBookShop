// middleware/auth.js
function requireLogin(req, res, next) {
  // console.log("Session:", req.session);
  if (req.session && req.session.user) {
    console.log("Logged in:", req.session.user);
    return next();
  } else {
    console.log("Not logged in");
    return res.redirect('/user.html');
  }
}

module.exports = requireLogin;
