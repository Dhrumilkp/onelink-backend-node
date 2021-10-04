const db = require('../../config/db');
const admin = require('firebase-admin');
const mailjet = require('node-mailjet').connect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE);
var speakeasy = require("speakeasy");

module.exports = {
    BasicSignIn:(body,callback) => {
       const email = body.email;
       const password = body.password;
       
    }
};