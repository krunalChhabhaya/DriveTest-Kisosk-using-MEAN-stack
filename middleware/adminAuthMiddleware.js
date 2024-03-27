module.exports = (req, res, next) => {
    if (req.session && req.session.userType === 'Admin') {
        next();
    } else {
        res.redirect('/');
    }
};