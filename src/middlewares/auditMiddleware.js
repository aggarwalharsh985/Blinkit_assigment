const AuditService = require('../services/auditService');

// Middleware to extract IP and User Agent
const extractClientInfo = (req, res, next) => {
    req.clientInfo = {
        ip: req.ip || req.connection.remoteAddress || req.socket.remoteAddress,
        userAgent: req.get('User-Agent') || 'Unknown'
    };
    next();
};

// Middleware to log all admin actions
const logAdminActions = (actionType) => {
    return (req, res, next) => {
        // Store original end function
        const originalEnd = res.end;
        
        // Override end function to log after response
        res.end = function(chunk, encoding) {
            // Only log if response was successful
            if (res.statusCode >= 200 && res.statusCode < 300) {
                AuditService.logAdminAction({
                    adminId: req.user?.id,
                    adminemail: req.user?.email,
                    targetUserId: req.params?.id || req.body?.targetUserId,
                    actionType: actionType,
                    details: {
                        method: req.method,
                        path: req.path,
                        body: req.body,
                        params: req.params,
                        query: req.query
                    },
                    ip: req.clientInfo?.ip,
                    userAgent: req.clientInfo?.userAgent
                });
            }
            
            // Call original end function
            originalEnd.call(this, chunk, encoding);
        };
        
        next();
    };
};

module.exports = {
    extractClientInfo,
    logAdminActions
};