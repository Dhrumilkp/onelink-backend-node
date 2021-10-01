const {
    CreateNewVerificationOTP
} = require('./otp_service');

module.exports = {
    SendVerificationOtp:(req,res) => {
        const body = req.body;
        CreateNewVerificationOTP(body,(err,results) => {

        });
    }
};