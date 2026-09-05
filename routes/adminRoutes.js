const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

// ------------------------------------
// Admin Inventory Route
// ------------------------------------

router.get(
    "/inventory",
    authMiddleware,
    adminMiddleware,
    (req, res) => {

        res.status(200).json({
            success: true,
            message: "Inventory dashboard",
            user: {
                id: req.user._id,
                name: req.user.name,
                email: req.user.email,
                role: req.user.role
            }
        });

    }
);

module.exports = router;