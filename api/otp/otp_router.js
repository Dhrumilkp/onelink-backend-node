const {
    SendVerificationOtp,
    VerifyOtp
} = require('./otp_controller');
// TOKEN CHECK 
const {
    checkToken
} = require('../../auth/token_validation');
const router = require('express').Router();
const rateLimit = require('express-rate-limit');

const otp_send_limit = rateLimit({
    windowMs : 60 * 60 * 1000,
    max : 3,
    handler: function (req, res, /*next*/) {
        return res.status(429).json({
          error: 'You sent too many requests. Please wait a while then try again'
        })
    }
});

// define routers here
router.post("/send-otp",checkToken,otp_send_limit,SendVerificationOtp);
router.post("/verify-otp",checkToken,otp_send_limit,VerifyOtp);
module.exports = router;