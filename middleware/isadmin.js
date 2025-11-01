function requireAdmin(req, res, next) {
  if (req.session && req.session.user && req.session.user.is_admin === 1) {
    console.log("Admin access granted:", req.session.user.username);
    return next();
  } else {
    console.log("Admin access denied");
    return res.redirect('/');
  }
}

module.exports = requireAdmin;
