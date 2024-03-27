const User = require('../models/User');

exports.updateCarInfo = async (req, res) => {
    const userId = req.body.userId;
    try {
        const updatedUser = await User.findOneAndUpdate(
            { _id: userId },
            {
                $set: {
                    'car_details.make': req.body.car_details_make,
                    'car_details.model': req.body.car_details_model,
                    'car_details.year': req.body.car_details_year,
                    'car_details.platno': req.body.car_details_platno,
                },
            },
            { upsert: true, new: true }
        );

        if (!updatedUser) {
            return res.render('g_test', { error: 'User not found' });
        }

        const message = 'Car information updated successfully';

        res.render('update_car', { user: updatedUser, message });

    } catch (error) {
        console.error(error);
        res.render('update_car', { error: 'An error occurred while updating car information' });
    }
}
