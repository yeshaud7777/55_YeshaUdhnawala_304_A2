const fs = require("fs");
const path = require("path");

const Post = require("../models/Post");

// ==========================================
// CREATE POST
// ==========================================

const createPost = async (req, res) => {
    try {
        const {
            title,
            content,
            tags,
            published
        } = req.body;

        if (!title || !content) {
            return res.status(400).json({
                success: false,
                message: "Title and content are required"
            });
        }

        let parsedTags = [];

        if (tags) {
            if (Array.isArray(tags)) {
                parsedTags = tags;
            } else {
                parsedTags = tags
                    .split(",")
                    .map(tag => tag.trim());
            }
        }

        const post = await Post.create({
            title,
            content,
            tags: parsedTags,
            published: published === true || published === "true",
            author: req.user._id
        });

        return res.status(201).json({
            success: true,
            message: "Post created successfully",
            data: post
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ==========================================
// GET ALL OWN POSTS
// ==========================================

const getPosts = async (req, res) => {
    try {
        const posts = await Post.find({
            author: req.user._id
        })
            .populate("author", "name email")
            .sort({
                createdAt: -1
            });

        return res.status(200).json({
            success: true,
            count: posts.length,
            data: posts
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ==========================================
// GET SINGLE POST
// ==========================================

const getPost = async (req, res) => {
    try {
        const post = await Post.findOne({
            _id: req.params.id,
            author: req.user._id
        }).populate(
            "author",
            "name email"
        );

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: post
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ==========================================
// UPDATE POST
// ==========================================

const updatePost = async (req, res) => {
    try {
        const post = await Post.findById(
            req.params.id
        );

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        const isOwner =
            post.author.toString() ===
            req.user._id.toString();

        const isAdmin =
            req.user.role === "admin";

        if (!isOwner && !isAdmin) {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to update this post"
            });
        }

        const {
            title,
            content,
            tags,
            published
        } = req.body;

        if (title !== undefined) {
            post.title = title;
        }

        if (content !== undefined) {
            post.content = content;
        }

        if (tags !== undefined) {
            post.tags = Array.isArray(tags)
                ? tags
                : tags.split(",").map(tag => tag.trim());
        }

        if (published !== undefined) {
            post.published =
                published === true ||
                published === "true";
        }

        await post.save();

        return res.status(200).json({
            success: true,
            message: "Post updated successfully",
            data: post
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ==========================================
// DELETE POST
// ==========================================

const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(
            req.params.id
        );

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        const isOwner =
            post.author.toString() ===
            req.user._id.toString();

        const isAdmin =
            req.user.role === "admin";

        if (!isOwner && !isAdmin) {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to delete this post"
            });
        }

        if (post.image) {
            const imagePath = path.join(
                __dirname,
                "..",
                post.image
            );

            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await Post.findByIdAndDelete(
            req.params.id
        );

        return res.status(200).json({
            success: true,
            message: "Post deleted successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ==========================================
// IMAGE UPLOAD
// ==========================================

const uploadImage = async (req, res) => {
    try {
        const post = await Post.findById(
            req.params.id
        );

        if (!post) {
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }

            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        const isOwner =
            post.author.toString() ===
            req.user._id.toString();

        const isAdmin =
            req.user.role === "admin";

        if (!isOwner && !isAdmin) {
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }

            return res.status(403).json({
                success: false,
                message: "You are not allowed"
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Image is required"
            });
        }

        // Delete old image
        if (post.image) {
            const oldImagePath = path.join(
                __dirname,
                "..",
                post.image
            );

            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
        }

        post.image =
            `/uploads/${req.file.filename}`;

        await post.save();

        return res.status(200).json({
            success: true,
            message: "Image uploaded successfully",
            image: post.image
        });

    } catch (error) {
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createPost,
    getPosts,
    getPost,
    updatePost,
    deletePost,
    uploadImage
};