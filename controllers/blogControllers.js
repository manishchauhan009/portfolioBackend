const Blog = require("../models/blogSchema");
const cloudinary = require("../config/cloudinary");
const slugify = require("slugify");

// ➕ Add Blog
const addBlog = async (req, res, next) => {
  try {
    const {
      title,
      description,
      content,
      image,
      category,
      tags,
      author,
      metaTitle,
      metaDescription,
      isPublished,
    } = req.body;

    const slug = slugify(title, { lower: true, strict: true });

    const blog = new Blog({
      title,
      slug,
      description,
      content,
      image,
      category,
      tags,
      author,
      metaTitle: metaTitle || title,
      metaDescription: metaDescription || description,
      isPublished,
      publishedAt: isPublished ? new Date() : null,
    });

    await blog.save();
    res.status(201).json({ success: true, message: "✅ Blog created", blog });
  } catch (err) {
    next(err);
  }
};

// 📚 Get All Blogs
const getBlogs = async (req, res, next) => {
  try {
    const { category, tag, search, page = 1, limit = 10 } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (tag) filter.tags = { $in: [tag] };
    if (search) {
      filter.$text = { $search: search };
    }

    const blogs = await Blog.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Blog.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    res.json({ total, page: Number(page), totalPages, blogs });
  } catch (err) {
    next(err);
  }
};

// 🔍 Get Single Blog
const getBlogById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findOne({
      $or: [{ _id: id }, { slug: id }],
    });

    if (!blog) return res.status(404).json({ message: "Blog not found" });

    blog.views += 1;
    await blog.save();

    res.json(blog);
  } catch (err) {
    next(err);
  }
};

// ✏️ Update Blog
const updateBlog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      content,
      image,
      category,
      tags,
      author,
      metaTitle,
      metaDescription,
      isPublished,
    } = req.body;

    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    if (image && image.public_id && blog.image?.public_id !== image.public_id) {
      await cloudinary.uploader.destroy(blog.image.public_id);
      blog.image = image;
    }

    if (title && title !== blog.title) {
      blog.slug = slugify(title, { lower: true, strict: true });
    }

    Object.assign(blog, {
      title,
      description,
      content,
      category,
      tags,
      author,
      metaTitle,
      metaDescription,
    });

    if (typeof isPublished !== "undefined") {
      blog.isPublished = isPublished;
      if (isPublished && !blog.publishedAt) blog.publishedAt = new Date();
    }

    await blog.save();
    res.json({ success: true, message: "✅ Blog updated", blog });
  } catch (err) {
    next(err);
  }
};

// 🗑️ Delete Blog
const deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    if (blog.image?.public_id) {
      await cloudinary.uploader.destroy(blog.image.public_id);
    }

    await blog.deleteOne();
    res.json({ success: true, message: "Blog deleted" });
  } catch (err) {
    next(err);
  }
};

// 🔢 Blog Count
const getBlogCount = async (req, res, next) => {
  try {
    const count = await Blog.countDocuments({ isPublished: true });
    res.json({ count });
  } catch (err) {
    next(err);
  }
};

// ❤️ Like Blog
const likeBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    const userIp = req.ip; // get visitor IP

    if (blog.likes.includes(userIp)) {
      // If already liked, remove like (toggle)
      blog.likes = blog.likes.filter((ip) => ip !== userIp);
    } else {
      blog.likes.push(userIp);
    }

    await blog.save();

    // Send like count as number
    res.json({ success: true, likes: blog.likes.length });
  } catch (err) {
    next(err);
  }
};


// 💬 Add Comment
const addComment = async (req, res, next) => {
  try {
    console.log("Your Comment is ", req.body)
    const { author, text } = req.body;
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    blog.comments.push({ author, text });
    await blog.save();

    res.json({ success: true, comments: blog.comments });
  } catch (err) {
    next(err);
  }
};

// 📈 Increment Blog Views
const incrementViews = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.status(200).json(blog);
  } catch (err) {
    res.status(500).json({ message: "Error incrementing views", error: err.message });
  }
};


module.exports = {
  addBlog,
  getBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  getBlogCount,
  likeBlog,
  addComment,
  incrementViews
};
