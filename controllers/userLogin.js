const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const userData = await User.findOne({ username });
        
        if (userData) {
            const passwordMatch = await bcrypt.compare(password, userData.password);

            if (passwordMatch) {
                req.session.userId = userData._id
                req.session.userType = userData.UserType
            res.redirect('/');
            } else {
                res.render('login', { loginerror: 'Invalid password' });
            }
        } else {
            res.render('login', { loginerror: 'Invalid username' });
        }
    } catch (error) {
        console.error(error);
        res.render('login', { loginerror: 'An error occurred during login' });
    }
};