const {
    Createnewuser
} = require('./signup_service');
const { sign } = require("jsonwebtoken");

module.exports = {
    CreateNewUser:(req,res) => {
        const body = req.body;
        var subdomain_name = body.subdomain_name;
        var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
        if(format.test(subdomain_name)){
            return res.status(200).json({
                status: "err",
                message: "subdomain cannot have any special character or white spaces"
            });
        }
        if (/\s/.test(subdomain_name)) {
            // It has any kind of whitespace
            return res.status(200).json({
                status: "err",
                message: "subdomain name cannot have white spaces"
            });
        }
        else
        {
            Createnewuser(body,(err,results) => {
            
                if(err)
                {
                    return res.status(500).json({
                        status: "err",
                        message: "Internal server err, please reach out to our support team on "+process.env.SUPPORT_EMAIL+""
                    });
                }
                if(results == "username_taken")
                {
                    return res.status(200).json({
                        status: "err",
                        message: "subdomain already in use, try some other name"
                    });
                }
                if(results == "email_taken")
                {
                    return res.status(200).json({
                        status: "err",
                        message: "email is already in use, try some other email"
                    });
                }
                // Generate webtoken
                const jsontoken = sign({result:results.unique_id},process.env.JWT_KEY,{
                    expiresIn: "1h"
                });
                delete results['password_token'];
                delete results['current_otp'];
                delete results['created_on'];
                return res.status(200).json({
                    status: "success",
                    message: "User created",
                    basic_info : results,
                    auth_pass_token : jsontoken
                });
            });
        }
    }
};