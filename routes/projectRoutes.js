const express = require("express");
const Project=require("../models/projectSchema")
const router = express.Router();

// Add New Project (Admin Only)
router.post("/add", async (req, res) => {
  try {
    const { title, description, image, link, category } = req.body;

    if (!title || !description || !image || !link || !category) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const newProject = new Project({ title, description, image, link, category });
    await newProject.save();

    res.status(201).json({ message: "Project added successfully!" });
  } catch (error) {
    console.error("❌ Project creation error:", error);
    res.status(500).json({ error: "Failed to add project" });
  }
});


// Get All Projects
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});

// Update Project (Admin Only)
router.put("/update/:id", async (req, res) => {
  try {
    const updatedProject = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedProject);
  } catch (error) {
    res.status(500).json({ error: "Failed to update project" });
  }
});

// Delete Project (Admin Only)
router.delete("/delete/:id", async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Project deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete project" });
  }
});

module.exports = router;
