const express = require("express");
const {
  addBlog,
  getBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  getBlogCount,
  likeBlog,
  addComment,
  incrementViews
} = require("../controllers/blogControllers");
const { validateBlog } = require("../validators/blogValidator");

const router = express.Router();

// ➕ Create Blog
router.post("/", validateBlog, addBlog);

// 📚 Get All Blogs
router.get("/", getBlogs);

// 🔍 Get Single Blog by Slug or ID
router.get("/:id", getBlogById);

// ✏️ Update Blog
router.put("/:id", validateBlog, updateBlog);

// 🗑️ Delete Blog
router.delete("/:id", deleteBlog);

// 🔢 Blog Count
router.get("/count/all", getBlogCount);

// ❤️ Like Blog
router.patch("/:id/likes", likeBlog);

// 💬 Add Comment
router.post("/:id/comments", addComment);
// 📈 Increment Blog Views
router.patch("/:id/views", incrementViews);


module.exports = router;
