const db = require('../../config/db');
const mailjet = require('node-mailjet').connect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE);
var speakeasy = require("speakeasy");

module.exports = {
    CreateNewVerificationOTP: (body, callback) => {
        // Get users details
    },
    Verifyusersotp:(body,callback) =>{
        
    }
};