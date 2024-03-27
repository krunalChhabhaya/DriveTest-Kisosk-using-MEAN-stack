const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

// Define the User schema
const UserSchema = new Schema({
    firstname: {
        type: String,
        default: 'default',
    },
    lastname: {
        type: String,
        default: 'default',
    },
    licenseno: {
        type: String,
        default: 'default',
    },
    age: {
        type: Number,
        default: 0,
    },
    dob: {
        type: Date,
        default: new Date('2000-01-01'),
    },
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    UserType: {
        type: String,
        required: true,
    },
    car_details: {
        make: {
            type: String,
            default: 'default',
        },
        model: {
            type: String,
            default: 'default',
        },
        year: {
            type: Number,
            default: 0,
        },
        platno: {
            type: String,
            default: 'default',
        },
    },
    bookedAppointments: [{
        type: Schema.Types.ObjectId,
        ref: 'Appointment',
    }],
    TestType: {
        type: String,
        default: 'default',
    },
    comment: String,
    result: Boolean,
});

// pre-save hook to hash the password before saving
UserSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        try {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
        } catch (error) {
            return next(error);
        }
    }
    next();
});
// pre-save hook to hash the licenseno field
UserSchema.pre('save', async function (next) {
    if (this.isModified('licenseno')) {
        try {
            const salt = await bcrypt.genSalt(10);
            this.licenseno = await bcrypt.hash(this.licenseno, salt);
        } catch (error) {
            return next(error);
        }
    }
    next();
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
