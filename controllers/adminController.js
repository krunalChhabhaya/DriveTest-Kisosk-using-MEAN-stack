const User = require('../models/User');
const Appointment = require('../models/Appointment');

exports.getAdminResultPage = async (req, res) => {
    try {
        const usersWithCompletedTests = await User.find({
            $and: [{ comment: { $exists: true, $ne: '' } }, { result: { $exists: true } }],
        }).populate('bookedAppointments');

        res.render('admin_result', { users: usersWithCompletedTests });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

