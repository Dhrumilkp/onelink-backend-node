
const admin = require('firebase-admin');
const serviceAccount = require('../service_account.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();
db.settings({
    timestampsInSnapshots: true
});

module.exports = db;