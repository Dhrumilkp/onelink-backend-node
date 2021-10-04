const {
    CreateNewVerificationOTP,
    Verifyusersotp
} = require('./otp_service');

module.exports = {
    SendVerificationOtp:(req,res) => {
        const body = req.body;
        CreateNewVerificationOTP(body,(err,results) => {
            if(results == 'err')
            {
                return res.status(500).json({
                    status: "err",
                    message: "Internal server err, please reach out to our support team on "+process.env.SUPPORT_EMAIL+""
                });
            }
            if(results == 'email-fail')
            {
                return res.status(200).json({
                    status: "err",
                    message: "Internal server err, please reach out to our support team on "+process.env.SUPPORT_EMAIL+""
                });
            }
            return res.status(200).json({
                status: "success",
                message: "New otp email has been sent to your register mail id"
            });
        });
    },
    VerifyOtp:(req,res) => {
        const body = req.body;
        Verifyusersotp(body,(err,results) => {
            if(results == "otp-verified")
            {
                return res.status(200).json({
                    status: "success",
                    message: "Your email has been verified"
                });
            }
            if(results == "wrong-otp")
            {
                return res.status(200).json({
                    status: "err",
                    message: "Wrong otp"
                });
            }
            if(err)
            {
                return res.status(500).json({
                    status: "err",
                    message: "Internal server err, please reach out to our support team on "+process.env.SUPPORT_EMAIL+""
                });
            }
        });
    }
};