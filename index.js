require('dotenv').config()
const express = require('express');
const app = express();
// SET JSON BODY AND SET ORIGIN HEADERS
app.use(express.json());
// app.use(function (req, res, next) {
//     // Website you wish to allow to connect
//     if (req.hostname.endsWith('onelink.cards')) {
//         res.setHeader('Access-Control-Allow-Origin', '*');
//         res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type');
//         res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
//     }
//     res.setHeader('accept-ranges','bytes');
//     res.setHeader('content-type','application/json');
//     res.setHeader('referrer-policy','origin-when-cross-origin');
//     res.setHeader('referrer-policy','strict-origin-when-cross-origin');
//     // Pass to next layer of middleware
//     next();
// });
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


// Port
const port = process.env.PORT || 3000;
app.listen(port,() =>{
    console.log(`Listening on port ${port}`);
});