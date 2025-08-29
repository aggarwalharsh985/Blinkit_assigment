const jwt = require("jsonwebtoken");
const AuditService = require("../services/auditService");
const verifyToken = (req,res,next) => {
    let token;
    let authHeader = req.headers.Authorization || req.headers.authorization;
    if(authHeader && authHeader.startsWith("Bearer")){
        token = authHeader.split(" ")[1];
        if(!token){

            // No token
            AuditService.logTokenVerification({
                userId: null,
                success: false,
                ip: req.clientInfo?.ip,
                route: req.path,
                details: 'No token provided'
            });

            return res
                .status(401)
                .json({message: "No token, Authorization denied"});
        }
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decode;

            // Log successful token verification
            AuditService.logTokenVerification({
                userId: decode.id,
                success: true,
                ip: req.clientInfo?.ip,
                route: req.path
            });

            console.log("The decoded user is: ",req.user);
            next();
        } catch (err) {

            // Log failed token verification
            AuditService.logTokenVerification({
                userId: null,
                success: false,
                ip: req.clientInfo?.ip,
                route: req.path,
                details: 'Invalid token'
            });

            res.status(400).json({message: "Token is not valid"});
        }
    }else{

        AuditService.logTokenVerification({
            userId: null,
            success: false,
            ip: req.clientInfo?.ip,
            route: req.path,
            details: 'No authorization header'
        });

        return res
                .status(401)
                .json({message: "No token, Authorization denied"});
    }
};
module.exports = verifyToken;