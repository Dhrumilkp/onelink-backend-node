const db = require('../../config/db');
const mailjet = require('node-mailjet').connect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE);
var speakeasy = require("speakeasy");

// Check if user exsist in database
async function checkifuserexsist(email) 
{
    var snap = await db.collection("mari_users").where('email', '==', email)
    .get();
    if(snap.empty)
    {
        return false;
    }
    else
    {
        
    }
}
module.exports = {
    BasicSignIn:(body,callback) => {
        checkifuserexsist(body.email).then(
            (data) => {
                if(data == false)
                {
                    // No user found 
                    callback(null,'no-user');
                }
                else
                {
                    console.log(data);
                }
            }
        )
    }
};