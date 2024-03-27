const User = require('../models/User');

exports.updateCar = async (req, res) => {
    const userId = req.session.userId;

    if (!userId) {
        return res.redirect('/login');
    }

    try {
        const user = await User.findById(userId).exec();
        if (user.licenseno === 'default') {
            return res.render('update_car', { user}); 
        } else {
            return res.render('update_car', { user });
        }
    } catch (error) {
        console.error(error);
        res.render('error', { error: 'An error occurred while loading the page' });
    }
};
