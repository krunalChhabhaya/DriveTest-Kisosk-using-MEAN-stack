module.exports = (req, res, next) => {
  if (req.session && req.session.userType === 'Driver') {
      next();
  } else {
      res.redirect('/');
  }
};