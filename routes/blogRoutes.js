const express = require("express");
const {
  addBlog,
  getBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  getBlogCount,
  deleteImage
} = require("../controllers/blogControllers");

const router = express.Router();

// ➕ Add New Blog (Admin Only)
router.post("/add", addBlog);

// 📚 Get All Blogs
router.get("/", getBlogs);

// 🔍 Get Single Blog by ID
router.get("/:id", getBlogById);

// ✏️ Update Blog (Admin Only)
router.post("/update/:id", updateBlog);

// 🗑️ Delete Blog (Admin Only)
router.delete("/delete/:id", deleteBlog);

// 🔢 Blog Count (Analytics)
router.get("/count", getBlogCount);
router.post("/delete-image",deleteImage);

module.exports = router;
