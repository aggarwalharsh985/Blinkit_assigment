const AuditService = require("../services/auditService");
const authorizeRoles = (...allowedRoles) => {
    return (req,res,next) => {
        const hasAccess = allowedRoles.includes(req.user.role);

        // Log role authorization attempt
        AuditService.logRoleAuthorization({
            userId: req.user.id,
            userRole: req.user.role,
            requiredRoles: allowedRoles,
            success: hasAccess,
            route: req.path,
            ip: req.clientInfo?.ip
        });

        if(!hasAccess){
            return res.status(403).json({message: "Access denied"});
        }
        next();
    };
};
module.exports = authorizeRoles;