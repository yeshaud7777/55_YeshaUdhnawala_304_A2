const express = require("express");

const {
    register,
    login,
    profile
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

const rateLimit = require("express-rate-limit");

const router = express.Router();

// ------------------------------------
// Rate Limiter
// ------------------------------------

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,

    message: {
        success: false,
        message: "Too many requests. Try again later."
    }
});

// ------------------------------------
// Routes
// ------------------------------------

router.post(
    "/register",
    authLimiter,
    register
);

router.post(
    "/login",
    authLimiter,
    login
);

router.get(
    "/profile",
    authMiddleware,
    profile
);



module.exports = router;