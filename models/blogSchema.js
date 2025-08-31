const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Blog title is required"],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, "Blog description is required"],
      trim: true,
    },
    content: {
      type: String,
      required: [true, "Blog content is required"],
    },
    image: {
      url: { type: String, required: true },
      public_id: { type: String, required: true },
    },
    category: {
      type: String,
      enum: ["Technology", "Data Science", "Web Development", "AI", "Other"],
      default: "Other",
    },
    tags: [{ type: String }],

    author: {
      name: { type: String, default: "Admin" },
      avatar: { type: String, default: "" },
    },

    views: { type: Number, default: 0 },
    likes: {
      type: [String], // array of strings (IP addresses)
      default: [],    // default empty array
    },

    // likes: { type: Number, default: 0 },

    comments: [
      {
        text: String,
        author: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],

    metaTitle: { type: String, trim: true },
    metaDescription: { type: String, trim: true },

    isPublished: { type: Boolean, default: false },
    publishedAt: { type: Date },
  },
  { timestamps: true }
);

// Full-text index for search
blogSchema.index({ title: "text", description: "text", content: "text" });

const Blog = mongoose.model("Blog", blogSchema);
module.exports = Blog;
