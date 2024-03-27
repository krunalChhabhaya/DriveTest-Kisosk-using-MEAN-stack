const User = require('../models/User');

exports.signup = async (req, res) => {
    const { username, password, confirmPassword } = req.body;
    let usernameError, passwordError; 

    if (password !== confirmPassword) {
        passwordError = 'Passwords do not match';
    }

    try {
        const existingUser = await User.findOne({ username });

        if (existingUser) {
            usernameError = 'Username is already taken';
        }

        if (usernameError || passwordError) {
            return res.render('login', { usernameError, passwordError });
        }

        const newUser = new User(req.body);

        await newUser.save();

        res.render('login', { success: 'Signup successful. You can now login.' });
    } catch (error) {
        console.error(error);
        res.render('login', { error: 'An error occurred during signup' });
    }
}