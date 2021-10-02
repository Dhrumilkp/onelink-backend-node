const { verify } = require ("jsonwebtoken");
module.exports = {
    checkHosts:(req,res,next) => {
        const req_hostname = req.hostname;
        if(req_hostname === process.env.HOSTNAME)
            next();
        else
            res.status(403).json({
                status  : "err",
                message : "Access denied, Unauthorized Host"
            });
    },
    checkToken:(req,res,next) => {
        let token = req.get("authorization");
        if(token)
        {
            token = token.slice(7);
            verify(token,process.env.JWT_KEY,(err,decoded) => {
                if(err)
                {
                    res.status(403).json({
                        status  : "err",
                        message : "Access denied, Unauthorized user"
                    });
                }else
                {
                    next();
                }
            });
        }else
        {
            res.status(403).json({
                status  : "err",
                message : "Access denied, Unauthorized user"
            });
        }
    } 
}