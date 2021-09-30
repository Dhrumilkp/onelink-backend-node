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
                // See the UserRecord reference doc for the contents of userRecord.
                let data = {
                    subdomain_name : body.subdomain_name
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
            .catch(function (error) {
                callback(error);
            });
    }
};