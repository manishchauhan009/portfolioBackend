const Project = require("../models/projectSchema.js");
const cloudinary =require("../config/cloudinary.js");

const addProject = async (req, res) => {
  try {
    const { title, description, link, category, image } = req.body;

    // image will come as { url, public_id } from frontend
    const project = new Project({
      title,
      description,
      link,
      category,
      image,
    });

    await project.save();
    res.status(201).json({ success: true, project });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getProject= async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch projects" });
  }
}

const getupdateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    res.status(200).json(project);
  } catch (error) {
    console.log("Error fetching project for update:", error.message);
    res.status(500).json({ error: "Failed to fetch project" });
  }
};

const getProjectCount=async (req, res) => {
  const count = await Project.countDocuments();
  res.json({ count });
}

const updateProject = async (req, res) => {
  try {
    const { title, description, link, category, image } = req.body;
    const { id } = req.params;

    const project = await Project.findById(id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    // Replace image if new one provided
    if (image && image.public_id && image.url && image.public_id !== project.image.public_id) {
      // delete old image
      await cloudinary.v2.uploader.destroy(project.image.public_id);
      project.image = image; // assign new image object
    }

    project.title = title || project.title;
    project.description = description || project.description;
    project.link = link || project.link;
    project.category = category || project.category;

    await project.save();
    res.json({ success: true, project });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating project" });
  }
};


const deleteProject= async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Project deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete project" });
  }
}

const deleteImage = async (req, res) => {
  try {
    const { public_id } = req.body;
    if (!public_id) return res.status(400).json({ message: "No image provided" });

    await cloudinary.v2.uploader.destroy(public_id);
    res.json({ success: true, message: "Image deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting image" });
  }
};

module.exports={addProject,getProject,getupdateProject,deleteProject,updateProject,getProjectCount,deleteImage}