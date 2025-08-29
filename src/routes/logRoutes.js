const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");
const { extractClientInfo, logAdminActions } = require("../middlewares/auditMiddleware");
const { getAuditLogs, getLogStats } = require("../controllers/logController");

// Apply client info extraction to all routes
router.use(extractClientInfo);

// Only admin can access audit logs
router.get("/audit", 
    verifyToken, 
    authorizeRoles("admin"), 
    logAdminActions("VIEW_AUDIT_LOGS"),
    getAuditLogs
);

// Only admin can view log statistics
router.get("/stats", 
    verifyToken, 
    authorizeRoles("admin"), 
    logAdminActions("VIEW_LOG_STATS"),
    getLogStats
);

module.exports = router;