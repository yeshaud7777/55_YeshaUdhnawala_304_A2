const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const cors = require("cors");
const path = require("path");

dotenv.config();

const app = express();

// -------------------------------
// Middleware
// -------------------------------

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    console.log("METHOD:", req.method);
    console.log("URL:", req.url);
    console.log("BODY:", req.body);

    next();
});

app.use(
    helmet({
        contentSecurityPolicy: false
    })
);

app.use(
    cors({
        origin: process.env.ALLOWED_ORIGIN
    })
);

// -------------------------------
// Static Files
// -------------------------------

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// -------------------------------
// EJS
// -------------------------------

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// -------------------------------
// Routes
// -------------------------------

const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const viewRoutes = require("./routes/viewRoutes");
const adminRoutes = require("./routes/adminRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/", viewRoutes);
app.use("/api/admin", adminRoutes);

// -------------------------------
// Home
// -------------------------------

app.get("/", (req, res) => {
    res.send("Blog Management API is running...");
});

// -------------------------------
// 404
// -------------------------------

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

// -------------------------------
// MongoDB Connection
// -------------------------------

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully");

        app.listen(process.env.PORT, () => {
            console.log(
                `Server running on http://localhost:${process.env.PORT}`
            );
        });
    })
    .catch((error) => {
        console.error("MongoDB connection failed:", error.message);
    });