// Update controllers/appointmentPage.js
const Appointment = require('../models/Appointment');
const User = require('../models/User');

exports.getAppointmentPage = async (req, res) => {
    const userAdmin = req.session.userType === 'Admin';
    const successMessage = req.flash('successMessage')[0];
    const availableSlots = []; 

    res.render('appointment', { userAdmin, errors: req.flash('errors'), successMessage, availableSlots });
};

exports.addAppointmentSlot = async (req, res) => {
    const { date, timeSlots } = req.body;

    // Check if the same time slot already exists for the given date
    const existingAppointment = await Appointment.findOne({ date, time: timeSlots });
    if (existingAppointment) {
        req.flash('errors', 'The selected time slot already exists for the given date.');
        return res.redirect('/appointment');
    }

    // Save new appointment slot
    await Appointment.create({ date, time: timeSlots });

    req.flash('successMessage', 'Appointment slot added successfully!');
    res.redirect('/appointment');
};

exports.checkAppointments = async (req, res) => {
    const { date } = req.query;

    try {
        const existingAppointments = await Appointment.find({ date });

        const bookedSlots = existingAppointments.map(appointment => appointment.time);

        res.json({ bookedSlots });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
