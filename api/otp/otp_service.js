const db = require('../../config/db');
const mailjet = require('node-mailjet').connect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE);
var speakeasy = require("speakeasy");

module.exports = {
    CreateNewVerificationOTP: (body, callback) => {
        // Get users details
        var unique_id = body.id;
        const getUser = async () => {
            const UserData = db.collection('mari_users').doc(unique_id);
            const result = await UserData.get();
            if (!result.exists) {
                return callback(null, 'err');
            } else {
                const users_data = result.data();
                var email = users_data.email;
                var displayName = users_data.firstname + +users_data.lastname;
                // Create a new OTP
                var secret = speakeasy.generateSecret({
                    length: 20
                });
                var otp = speakeasy.totp({
                    secret: secret.base32,
                    encoding: 'base32',
                    digits: 4,
                    step: 60,
                    window: 10
                });
                const UpdateOtpDb = async () => {
                    let data = {
                        current_otp: otp
                    };
                    const query_update_otp = db.collection('mari_users').doc(unique_id);
                    const res = await query_update_otp.update(data);
                    // Send email 
                    const SendEmailUser = async () => {
                        const request = mailjet
                            .post("send", {
                                'version': 'v3.1'
                            })
                            .request({
                                "Messages": [{
                                    "From": {
                                        "Email": "security-noreply@onelink.cards",
                                        "Name": "Onelink.cards"
                                    },
                                    "To": [{
                                        "Email": email,
                                        "Name": displayName
                                    }],
                                    "TemplateID": 2922706,
                                    "TemplateLanguage": true,
                                    "Subject": "[[data:firstname:" + displayName + "]] , your verification code is [[data:OTP:" + otp + "]]",
                                    "Variables": {
                                        "OTP": otp
                                    }
                                }]
                            })
                        request
                            .then((result) => {
                                return callback(null, 'email-sent');
                            })
                            .catch((err) => {
                                return callback(null, 'email-fail');
                            });
                    }
                    SendEmailUser();
                }
                UpdateOtpDb();
            }
        }
        getUser();
    }
};