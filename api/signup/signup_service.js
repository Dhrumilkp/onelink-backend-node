const db = require('../../config/db');
const {
    genSaltSync,
    hashSync
} = require("bcryptjs");
const salt = genSaltSync(10);
const mailjet = require ('node-mailjet').connect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE);
var speakeasy = require("speakeasy");

module.exports = {
    Createnewuser: (body, callback) => {
        // Check if subdomain is available
        const username = body.subdomain_name;
        db.collection("mari_users").where('subdomain_name','==',username)
        .get()
        .then((snapshot) => {
            if(snapshot.empty)
            {
                // Generate otp for this user 
                var secret = speakeasy.generateSecret({length: 20});
                var otp = speakeasy.totp({
                    secret: secret.base32,
                    encoding: 'base32',
                    digits:4,
                    step: 60,
                    window:10
                });
                // Create new user
                let data = {
                    email: body.email,
                    emailVerified: false,
                    password: body.password_token,
                    displayName: body.firstname +''+ body.lastname,
                    disabled: false,
                    subdomain_name : body.subdomain_name,
                    current_otp    : otp
                }
                db.collection("mari_users").add(data)
                .then(docRef => {
                    body.unique_id = docRef.id;
                    // Send email
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
                                    "Email": body.email,
                                    "Name": body.firstname +' '+ body.lastname
                                }],
                                "TemplateID": 2922706,
                                "TemplateLanguage": true,
                                "Subject": "[[data:firstname:" + body.firstname +' '+ body.lastname + "]] , your verification code is [[data:OTP:" + otp + "]]",
                                "Variables": {
                                    "OTP": otp
                                }
                            }]
                        })
                    request
                        .then((result) => {
                            body.email_send_status = "success";
                            return callback(null,body);
                        })
                        .catch((err) => {
                            body.email_send_status = "failed";
                            return callback(null,body);
                        });
                })
                .catch(err => {
                    console.log(err);
                })
            }
            else
            {
                return callback(null,'username_taken');
            }
        })
        .catch((error) => {
            console.log(error);
        })      
    }
};