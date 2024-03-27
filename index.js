// Group - 7 Final Group Project
// Group Members - Krunal Chhabhaya, Ashish, Karan Bhavsar, Rushikesh Haveliwala

const express = require('express');
const app = new express();
const ejs = require('ejs');
const mongoose = require('mongoose');
const userSignupController = require('./controllers/userSignup');
const g2StoreController = require('./controllers/g2Store');
const userLoginController = require('./controllers/userLogin');
const expressSession = require('express-session');
const g2PageController = require('./controllers/g2Page');
const gPageController = require('./controllers/gPage');
const updateCarController = require('./controllers/updateCarPage');
const updateCarUpdateController = require('./controllers/updateCarUpdate');
const appointmentController = require('./controllers/appointmentPage');
const loginPageController = require('./controllers/loginPage');
const examinerController = require('./controllers/examinerController');
const adminController = require('./controllers/adminController');
const authMiddleware = require('./middleware/authMiddleware');
const redirectIfAuthenticatedMiddleware = require('./middleware/redirectIfAuthenticatedMiddleware');
const driverAuthMiddleware = require('./middleware/driverAuthMiddleware');
const adminAuthMiddleware = require('./middleware/adminAuthMiddleware');
const examinerAuthMiddleware = require('./middleware/examinerAuthMiddleware');
const logoutController = require('./controllers/logout');

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const flash = require('express-flash');

app.use(expressSession({
    secret: 'jaymataji',
    resave: false, 
    saveUninitialized: false, 
}));

app.use(flash());

const mongoUrl = "mongodb+srv://krunalchhabhaya7803:drivetest@drivetest.3bzg4gd.mongodb.net/";
mongoose.connect(mongoUrl, { useNewUrlParser: true });

app.listen(5000, () => {
    console.log('App listening on port 5000');
});

app.use((req, res, next) => {
    res.locals.loggedIn = req.session.userId;
    
    if (req.session.userType) {
        const userType = req.session.userType;

        if (userType === 'Driver') {
            res.locals.userDriver = userType;
            res.locals.userAdmin = null; 
            res.locals.userExaminer = null;
        } else if (userType === 'Admin') {
            res.locals.userAdmin = userType;
            res.locals.userDriver = null;
            res.locals.userExaminer = null; 
        } else if (userType === 'Examiner') {
            res.locals.userExaminer = userType;
            res.locals.userAdmin = null;
            res.locals.userDriver = null;
        } else {
            res.locals.userDriver = null;
            res.locals.userAdmin = null;
            res.locals.userExaminer = null;
        }
    } else {
        res.locals.userDriver = null;
        res.locals.userAdmin = null;
        res.locals.userExaminer = null;
    }

    next();
});


app.get('/', (req, res) => {
    res.render('index');
});

app.get('/login', redirectIfAuthenticatedMiddleware, loginPageController);
app.post('/login', redirectIfAuthenticatedMiddleware, userLoginController.login);
app.post('/signup', redirectIfAuthenticatedMiddleware, userSignupController.signup);
app.get('/appointment', adminAuthMiddleware, appointmentController.getAppointmentPage);
app.post('/appointment', adminAuthMiddleware, appointmentController.addAppointmentSlot);
app.get('/checkAppointment', adminAuthMiddleware, appointmentController.checkAppointments);
app.post('/checkAppointmentG2', g2PageController.checkAppointmentsG2);
app.post('/g2_test/book', g2PageController.bookG2Appointment);
app.post('/checkAppointmentG', gPageController.checkAppointmentsG);
app.post('/g_test/bo', gPageController.bookGApp);
app.get('/take_test', authMiddleware, examinerAuthMiddleware, examinerController.getTakeTestPage);
app.post('/take_test', authMiddleware, examinerController.getTakeTestPage);

app.get('/admin_result', adminController.getAdminResultPage);

app.post('/take_test/updateResult/:userId', authMiddleware, examinerController.updateResult);

app.post('/g2_test/store', authMiddleware, g2StoreController.store);
app.get('/g2_test', driverAuthMiddleware, authMiddleware, g2PageController.g2Page);
app.get('/g_test', driverAuthMiddleware, authMiddleware, gPageController.gPage);
app.get('/update_car', driverAuthMiddleware, authMiddleware, updateCarController.updateCar);

app.post('/updateCarInfo', authMiddleware, updateCarUpdateController.updateCarInfo);

app.get('/logout', logoutController);