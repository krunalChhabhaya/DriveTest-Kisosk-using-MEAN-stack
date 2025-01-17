const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AppointmentSchema = new Schema({
    date: {
        type: Date,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
    isTimeSlotAvailable: {
        type: Boolean,
        default: true,
    },
    bookedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
});

const Appointment = mongoose.model('Appointment', AppointmentSchema);

module.exports = Appointment;
