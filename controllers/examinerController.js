const User = require('../models/User');
const Appointment = require('../models/Appointment');

exports.getTakeTestPage = async (req, res) => {
    try {
        const userExaminer = req.session.userType === 'Examiner';
        let usersWithCars = []; 

        if (req.body.testType) {
            const { testType } = req.body;

            if (testType === 'G2') {
                usersWithCars = await User.find({ TestType: 'G2' }).populate('bookedAppointments').select('firstname lastname licenseno car_details result comment');
            } else if (testType === 'G') {
                usersWithCars = await User.find({ TestType: 'G' }).populate('bookedAppointments').select('firstname lastname licenseno car_details result comment');
            }
        }

        res.render('take_test', { userExaminer, usersWithCars });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};


exports.updateResult = async (req, res) => {
    try {
        const { userId } = req.params;
        const { result, comment } = req.body;

        const user = await User.findById(userId);
        if (user) {
            user.result = result;
            user.comment = comment;
            await user.save();
        }

        res.redirect('/take_test');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};