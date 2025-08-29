const { auditLogger } = require('../config/loggerConfig');

class AuditService {
    static logLoginAttempt(data) {
        auditLogger.info('LOGIN_ATTEMPT', {
            action: 'LOGIN_ATTEMPT',
            email: data.email,
            success: data.success,
            ip: data.ip,
            userAgent: data.userAgent,
            timestamp: new Date().toISOString(),
            details: data.details || null
        });
    }

    static logAdminAction(data) {
        auditLogger.info('ADMIN_ACTION', {
            action: 'ADMIN_ACTION',
            adminId: data.adminId,
            adminemail: data.adminemail,
            targetUserId: data.targetUserId,
            actionType: data.actionType, // 'PERMISSION_UPDATE', 'USER_DELETE', etc.
            details: data.details,
            ip: data.ip,
            userAgent: data.userAgent,
            timestamp: new Date().toISOString()
        });
    }

    static logUserRegistration(data) {
        auditLogger.info('USER_REGISTRATION', {
            action: 'USER_REGISTRATION',
            email: data.email,
            role: data.role,
            ip: data.ip,
            userAgent: data.userAgent,
            timestamp: new Date().toISOString()
        });
    }

    static logTokenVerification(data) {
        auditLogger.info('TOKEN_VERIFICATION', {
            action: 'TOKEN_VERIFICATION',
            userId: data.userId,
            success: data.success,
            ip: data.ip,
            route: data.route,
            timestamp: new Date().toISOString()
        });
    }

    static logRoleAuthorization(data) {
        auditLogger.info('ROLE_AUTHORIZATION', {
            action: 'ROLE_AUTHORIZATION',
            userId: data.userId,
            userRole: data.userRole,
            requiredRoles: data.requiredRoles,
            success: data.success,
            route: data.route,
            ip: data.ip,
            timestamp: new Date().toISOString()
        });
    }
}

module.exports = AuditService;