const {
    CreateNewVerificationOTP
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
                return res.status(500).json({
                    status: "err",
                    message: "Internal server err, please reach out to our support team on "+process.env.SUPPORT_EMAIL+""
                });
            }
            return res.status(200).json({
                status: "success",
                message: "New otp email has been sent to your register mail id"
            });
        });
    }
};