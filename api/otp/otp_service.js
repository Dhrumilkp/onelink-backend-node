const admin = require('firebase-admin');
const db = require('../../config/db');
const mailjet = require('node-mailjet').connect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE);
var speakeasy = require("speakeasy");

async function sendotpemail(email, otp, displayName) {
    const request = await mailjet
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
    if (request) {
        return true;
    } else {
        return false;
    }
}
module.exports = {
    CreateNewVerificationOTP: (body, callback) => {
        // Get users details
        const unique_id = body.id;
        admin
            .auth()
            .getUser(unique_id)
            .then((userRecord) => {
                // See the UserRecord reference doc for the contents of userRecord.
                const email = userRecord.email;
                const displayName = userRecord.displayName;
                // Generate new otp
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
                // Update new otp in database 
                let user_data = {
                    current_otp: otp,
                };
                db.collection("mari_users").doc(unique_id).update(user_data)
                    .then(
                        (data) => {
                            sendotpemail(email, otp, displayName).then(
                                (data) => {
                                    if (data == true) {
                                        body.email_send_status = "success";
                                        body.id = userRecord.uid;
                                        return callback(null, body);
                                    }
                                }
                            )
                        }
                    )
                    .catch((err) => {
                        callback(err);
                    })
            })
            .catch((error) => {
                callback(error);
            });
    },
    Verifyusersotp: (body, callback) => {
        const unique_id = body.id;
        const otp = body.otp;
        const getusersdata = async () => {
            const cityRef = db.collection('mari_users').doc(unique_id);
            const doc = await cityRef.get();
            if (!doc.exists) {
                console.log('No such document!');
            } else {
                const user_doc_data = doc.data();
                const current_otp = user_doc_data.current_otp;
                if (current_otp == otp) {
                    // update user
                    admin
                        .auth()
                        .updateUser(unique_id, {
                            emailVerified: true,
                        })
                        .then((userRecord) => {
                            // See the UserRecord reference doc for the contents of userRecord.
                            callback(null,'otp-verified');
                        })
                        .catch((error) => {
                            callback(error);
                        });
                } else {
                    callback(null, 'wrong-otp');
                }
            }
        }
        getusersdata();

    }
};