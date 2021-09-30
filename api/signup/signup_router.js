const {
    CreateNewUser
} = require('./signup_controller');
const router = require('express').Router();
const rateLimit = require('express-rate-limit');

const SignupLimiter = rateLimit({
    windowMs : 60 * 60 * 1000,
    max : 5,
    message : "Too many accounts created from this IP, access block temporarely!"
});

// define routers here
router.post("/create-new-user",CreateNewUser);

module.exports = router;