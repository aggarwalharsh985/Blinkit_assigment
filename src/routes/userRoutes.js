const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");
const { extractClientInfo, logAdminActions } = require("../middlewares/auditMiddleware");

// Apply client info extraction to all routes
router.use(extractClientInfo);

// Only admin can access these route
router.get("/admin", verifyToken,authorizeRoles("admin"),logAdminActions("ACCESS_ADMIN_PANEL"), (req,res) => {
    res.json({message: "Welcome admin"});
})

// Only manager can access these route
router.get("/manager",verifyToken,authorizeRoles("admin","manager"),logAdminActions("ACCESS_MANAGER_PANEL"), (req,res) => {
    res.json({message: "Welcome manager"});
})

// Only user can access these route
router.get("/user",verifyToken,authorizeRoles("admin","manager","user"), (req,res) => {
    res.json({message: "Welcome user"});
})

module.exports = router;