require('dotenv').config()
const express = require('express');
const app = express();
// DEFINE ROUTERS PATH
const signup = require('./api/signup/signup_router');
// SET JSON BODY AND SET ORIGIN HEADERS
app.use(express.json());

// SET JSON RESPONSE WHEN SOMEONE VISIT THE PAGE
app.get("/",(req,res) =>{
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
app.use("/signup", signup);

// Port
const port = process.env.PORT || 3000;
app.listen(port,() =>{
    console.log(`Listening on port ${port}`);
});