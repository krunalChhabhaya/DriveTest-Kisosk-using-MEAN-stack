const User = require('../models/User');

module.exports = async (req, res, next) => {
    try {
        if (req.session && req.session.userId) {
            const user = await User.findById(req.session.userId).exec();
            if (user) {
                res.locals.userType = req.session.userType;
                return next();
            }
        }
        res.redirect('/login');
    } catch (error) {
        console.error(error);
        res.redirect('/login');
    }
};
