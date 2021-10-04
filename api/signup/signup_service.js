const db = require('../../config/db');
const admin = require('firebase-admin');
const mailjet = require('node-mailjet').connect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE);
var speakeasy = require("speakeasy");
const {
    response
} = require('express');

async function checkifsubdomainistaken(username) {
    const snap = await db.collection("mari_users").where('subdomain_name', '==', username).get();
    if (snap.empty) {
        return false;
    } else {
        return true;
    }
}
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
    if(request)
    {
        return true;
    }
    else
    {
        return false;
    }
}
module.exports = {
    Createnewuser: (body, callback) => {
        // Check if subdomain is available
        const username = body.subdomain_name;
        checkifsubdomainistaken(username).then(
            (data) => {
                if (data == false) {
                    // Subdomain is available
                    // Create user in auth
                    const displayName = ''+body.firstname+''+body.lastname+'';
                    console.log(displayName);
                    admin.auth().createUser({
                            email: body.email,
                            emailVerified: false,
                            password: body.password_token,
                            displayName: displayName,
                            disabled: false
                        })
                        .then(function (userRecord) {
                            // See the UserRecord reference doc for the contents of userRecord.
                            let user_id = userRecord.uid;
                            // Generate OTP
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
                            let user_data = {
                                subdomain_name: body.subdomain_name,
                                current_otp: otp,
                            };
                            db.collection("mari_users").doc(user_id).set(user_data).then(
                                    (data) => {
                                        sendotpemail(body.email, otp, displayName).then(
                                            (data) => {
                                                if(data == true)
                                                {
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
                        .catch(function (error) {
                            if (error.errorInfo.code == 'auth/email-already-exists') {
                                return callback(null, 'email_taken');
                            } else {
                                callback(error);
                            }
                        });

                } else {
                    return callback(null, 'username_taken');
                }
            }
        )
    }
};