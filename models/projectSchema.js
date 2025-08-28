const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    url: { type: String, required: true },
    public_id: { type: String, required: true },
  }
  ,
  link: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ["web", "ai", "data science", "mobile", "Others"], // Add more categories as needed
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Project = mongoose.model("Project", projectSchema);
module.exports = Project;
