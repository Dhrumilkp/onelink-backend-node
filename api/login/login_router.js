const {
    LoginUserBasic,
    LoginUserGoogle,
    LoginUserPhone,
    LoginUserEmailOtp
} = require('./login_controller');
const router = require('express').Router();
const rateLimit = require('express-rate-limit');

const LoginRateLimit = rateLimit({
    windowMs : 60,
    max : 5,
    message : "Too many login attemps, please try again after sometime!"
});

// define routers here
router.post('/basic',LoginRateLimit,LoginUserBasic);
router.post('/google',LoginRateLimit,LoginUserGoogle);
router.post('/phone',LoginRateLimit,LoginUserPhone);
router.post('/email-otp',LoginRateLimit,LoginUserEmailOtp);
module.exports = router;