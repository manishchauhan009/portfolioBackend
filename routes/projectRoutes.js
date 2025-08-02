const express = require("express");
const { addProject, getProject, updateProject, deleteProject } = require("../controllers/projectControllers");
const router = express.Router();

// Add New Project (Admin Only)
router.post("/add", addProject);

// Get All Projects
router.get("/",getProject);

// Update Project (Admin Only)
router.put("/update/:id", updateProject);

// Delete Project (Admin Only)
router.delete("/delete/:id",deleteProject);

module.exports = router;
