require('dotenv').config()
const express = require('express');
const app = express();
const {
    checkHosts
} = require('./auth/token_validation');
// DEFINE ROUTERS PATH
const signup = require('./api/signup/signup_router');
const otp = require('./api/otp/otp_router');
const login = require('./api/login/login_router');
// SET JSON BODY AND SET ORIGIN HEADERS
app.use(express.json());

// SET JSON RESPONSE WHEN SOMEONE VISIT THE PAGE
app.get("/",checkHosts,(req,res) =>{
    res.json({
        status      : "success",
        eventCode   : "200",
        message     : "api framework working",
        origins     : "Origins set",
        support_email   : "support@onelink.cards",
        report_bug      : "support@onelink.cards"
    }); 
});
// Routes
app.use("/signup",checkHosts,signup);
app.use("/otp",checkHosts,otp);
app.use("/login",checkHosts,login);
// Port
const port = process.env.PORT || 3000;
app.listen(port,() =>{
    console.log(`Listening on port ${port}`);
});