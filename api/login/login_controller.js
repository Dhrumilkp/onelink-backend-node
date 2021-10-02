const {
    BasicSignIn
} = require('./login_services');
const { sign } = require("jsonwebtoken");

module.exports = {
    LoginUserBasic:(req,res) => {
        const body = req.body;
        BasicSignIn(body,(err,results) => {
            if(results == "no-user")
            {
                return res.status(200).json({
                    status: "err",
                    message: "no such user found"
                });
            }
        });
    },
    LoginUserGoogle:(req,res) => {
        const body = req.body;
        console.log(body);
    },
    LoginUserPhone:(req,res) => {
        const body = req.body;
        console.log(body);
    },
    LoginUserEmailOtp:(req,res) => {
        console.log(req);
        const body = req.body;
    }
};