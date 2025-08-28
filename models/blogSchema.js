const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Blog title is required"],
      trim: true,
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
  },
  { timestamps: true } // adds createdAt & updatedAt
);

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
