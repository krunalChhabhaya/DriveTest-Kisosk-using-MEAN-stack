const User = require('../models/User');

exports.store = async (req, res) => {
    const userId = req.session.userId;
    const newLicenseNo = req.body.licenseno;

    if (!userId) {
        return res.redirect('/login');
    }

    try {
        const usero = await User.findById(userId);

        if (!usero) {
            return res.render('g2_test', { message: 'User not found' });
        }

        usero.firstname = req.body.firstname;
        usero.lastname = req.body.lastname;
        usero.licenseno = newLicenseNo;
        usero.age = req.body.age;
        usero.dob = req.body.dob;
        usero.car_details.make = req.body['car_details.make'];
        usero.car_details.model = req.body['car_details.model'];
        usero.car_details.year = req.body['car_details.year'];
        usero.car_details.platno = req.body['car_details.platno'];

        await usero.save();

res.redirect('http://localhost:5000/g2_test');
    } catch (error) {
        console.error(error);
        return res.render('error', { error: 'An error occurred while updating the information' });
    }
};
