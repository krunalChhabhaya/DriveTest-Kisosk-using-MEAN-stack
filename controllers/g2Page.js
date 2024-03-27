const User = require('../models/User');
const Appointment = require('../models/Appointment');

exports.g2Page = async (req, res) => {
  const userId = req.session.userId;
  try {
    const usero = await User.findById(userId);

    if (!usero) {
      return res.redirect('/login');
    } else {
      const appointments = await Appointment.find({ bookedBy: userId });

      const availableSlots = appointments.map(slot => slot.time);

      const { licenseno } = usero;

    if (usero.TestType === 'G2' && usero.comment && usero.result !== undefined) {
      return res.render('g2_test', { usero });
    }

      res.render('g2_test', { usero, availableSlots, licenseno });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

exports.checkAppointmentsG2 = async (req, res) => {
  const userId = req.session.userId;
  try {
    const usero = await User.findById(userId);
    const { selectedDate } = req.body;

    const appointments = await Appointment.find({ date: selectedDate });

    const bookedAppointments = await Appointment.find({
      _id: { $in: appointments.map(slot => slot._id) },
      isTimeSlotAvailable: false,
    });

    const bookedAppointmentIds = bookedAppointments.map(slot => slot._id.toString());

    const availableSlots = appointments.map(slot => ({
      ...slot.toObject(),
      isTimeSlotAvailable: !bookedAppointmentIds.includes(slot._id.toString()),
    }));

    res.render('g2_test', { usero, availableSlots });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

exports.bookG2Appointment = async (req, res) => {
  const userId = req.session.userId;
  const { selectedSlots } = req.body;

  try {
    await Appointment.updateMany({ _id: { $in: selectedSlots } }, { isTimeSlotAvailable: false });

    await User.findByIdAndUpdate(userId, { $addToSet: { bookedAppointments: selectedSlots }, $set: { TestType: "G2" } });
    req.flash('successMessage', 'G2 Appointment booked successfully!');

    res.redirect('/g2_test');
  } catch (error) {
    console.error(error);
    req.flash('errorMessage', 'Failed to book appointment. Please try again.');
    res.redirect('/g2_test');
  }
};