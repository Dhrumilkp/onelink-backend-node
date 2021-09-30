const admin = require('firebase-admin');
const serviceAccount = require('../../service_account.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();
db.settings({
    timestampsInSnapshots: true
});
const {
    genSaltSync,
    hashSync
} = require("bcryptjs");
const salt = genSaltSync(10);
const mailjet = require ('node-mailjet').connect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE);
var speakeasy = require("speakeasy");

module.exports = {
    Createnewuser: (body, callback) => {
        // Check if user exsist

        // Create new user
        admin.auth().createUser({
                email: body.email,
                emailVerified: false,
                password: body.password_token,
                displayName: body.firstname +''+ body.lastname,
                disabled: false,
            })
            .then(function (userRecord) {
                // Generate OTP
                var secret = speakeasy.generateSecret({length: 20});
                var otp = speakeasy.totp({
                    secret: secret.base32,
                    encoding: 'base32',
                    digits:4,
                    step: 60,
                    window:10
                });
                console.log(otp);
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
                        let data = {
                            subdomain_name : body.subdomain_name,
                            current_otp    : otp
                        }
                        db.collection("mari_users").doc(userRecord.uid).set(data)
                        .then(data => {
                            body.unique_id = userRecord.uid;
                            callback(null,body);
                        })
                        .catch(err => {
                            callback(err);
                        })
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            })
            .catch(function (error) {
                callback(error);
            });
    }
};