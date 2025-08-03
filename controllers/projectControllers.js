const Project=require("../models/projectSchema")
const addProject=async (req, res) => {
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
}

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
    console.log("Count Got")
  const count = await Project.countDocuments();
  res.json({ count });
}

const updateProject = async (req, res) => {
  try {
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedProject) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.status(200).json(updatedProject);
  } catch (error) {
    console.log("Error in Project Update:", error);
    res.status(500).json({ error: "Failed to update project" });
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
module.exports={addProject,getProject,getupdateProject,deleteProject,updateProject,getProjectCount}