const express = require("express");
const Post = require("../models/Post");

const router = express.Router();

// -----------------------------------
// Login Page
// -----------------------------------

router.get("/login", (req, res) => {

    res.render("login");

});

// -----------------------------------
// Published Posts
// -----------------------------------

router.get("/posts", async (req, res) => {

    try {

        const posts = await Post.find({
            published: true
        })
        .populate(
            "author",
            "name email"
        )
        .sort({
            createdAt: -1
        });

        res.render(
            "posts",
            {
                posts
            }
        );

    } catch (error) {

        res.status(500).send(
            "Error loading posts"
        );

    }

});

// -----------------------------------
// Dashboard
// -----------------------------------

router.get("/dashboard", (req, res) => {

    res.render("dashboard");

});

module.exports = router;