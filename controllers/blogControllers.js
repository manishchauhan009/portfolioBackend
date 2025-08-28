const Blog = require("../models/blogSchema");
const cloudinary = require("../config/cloudinary.js");

// ➕ Add Blog
const addBlog = async (req, res) => {
  try {
    const { title, description, content, image } = req.body;
    if (!title || !description || !content) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const blog = new Blog({ title, description, content, image });
    await blog.save();

    res.status(201).json({ success: true, message: "✅ Blog added successfully", blog });
  } catch (err) {
    console.error("Error adding blog:", err);
    res.status(500).json({ success: false, message: "❌ Failed to add blog", error: err.message });
  }
};

// 📚 Get All Blogs
const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.status(200).json(blogs);
  } catch (err) {
    res.status(500).json({ success: false, message: "❌ Failed to fetch blogs", error: err.message });
  }
};

// 🔍 Get Single Blog
const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.status(200).json(blog);
  } catch (err) {
    res.status(500).json({ success: false, message: "❌ Failed to fetch blog", error: err.message });
  }
};

// ✏️ Update Blog (with image cleanup)
const updateBlog = async (req, res) => {
  try {
    const { title, description, content, image } = req.body;
    const blog = await Blog.findById(req.params.id);

    if (!blog) return res.status(404).json({ message: "Blog not found" });

    // If new image provided & different -> delete old from Cloudinary
    if (image && image.public_id && image.url && blog.image?.public_id !== image.public_id) {
      if (blog.image?.public_id) await cloudinary.v2.uploader.destroy(blog.image.public_id);
      blog.image = image;
    }

    blog.title = title || blog.title;
    blog.description = description || blog.description;
    blog.content = content || blog.content;

    await blog.save();
    res.status(200).json({ success: true, message: "✅ Blog updated successfully", blog });
  } catch (err) {
    res.status(500).json({ success: false, message: "❌ Failed to update blog", error: err.message });
  }
};

// 🗑️ Delete Blog (with Cloudinary cleanup)
const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    if (blog.image?.public_id) {
      await cloudinary.v2.uploader.destroy(blog.image.public_id);
    }

    await blog.deleteOne();
    res.status(200).json({ success: true, message: "🗑️ Blog deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "❌ Failed to delete blog", error: err.message });
  }
};

// 🔢 Count Blogs
const getBlogCount = async (req, res) => {
  try {
    const count = await Blog.countDocuments();
    res.status(200).json({ count });
  } catch (err) {
    res.status(500).json({ success: false, message: "❌ Failed to count blogs", error: err.message });
  }
};

// 🖼️ Delete Image (manual call)
const deleteImage = async (req, res) => {
  try {
    const { public_id } = req.body;
    if (!public_id) return res.status(400).json({ message: "No image provided" });

    await cloudinary.v2.uploader.destroy(public_id);
    res.json({ success: true, message: "Image deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error deleting image", error: err.message });
  }
};

module.exports = {
  addBlog,
  getBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  getBlogCount,
  deleteImage
};
