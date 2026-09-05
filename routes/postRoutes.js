const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
    createPost,
    getPosts,
    getPost,
    updatePost,
    deletePost,
    uploadImage
} = require("../controllers/postController");

const router = express.Router();

// All post routes are protected
router.use(authMiddleware);

// Create
router.post(
    "/",
    createPost
);

// Get all own posts
router.get(
    "/",
    getPosts
);

// Get single
router.get(
    "/:id",
    getPost
);

// Update
router.put(
    "/:id",
    updatePost
);

// Delete
router.delete(
    "/:id",
    deletePost
);

// Upload image
router.post(
    "/:id/image",
    upload.single("image"),
    uploadImage
);

module.exports = router;