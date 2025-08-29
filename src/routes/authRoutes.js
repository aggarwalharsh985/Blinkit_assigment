const express = require("express");
const { register, login } = require("../controllers/authController");
const { extractClientInfo } = require("../middlewares/auditMiddleware");
const router = express.Router();

// Apply client info extraction to all routes
router.use(extractClientInfo);

router.post("/register",register);
router.post("/login",login);

module.exports = router;