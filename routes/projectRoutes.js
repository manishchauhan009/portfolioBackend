const express = require("express");
const { addProject, getProject, getupdateProject, deleteProject ,updateProject, getProjectCount, deleteImage} = require("../controllers/projectControllers");
const router = express.Router();

// Add New Project (Admin Only)
router.post("/add", addProject);

// Get All Projects
router.get("/",getProject);

// Update Project (Admin Only)
router.get("/update/:id", getupdateProject);
router.put("/update/:id", updateProject);
router.get('/count', getProjectCount);


// Delete Project (Admin Only)
router.delete("/delete/:id",deleteProject);

// Delete image
router.post("/delete-image",deleteImage);

module.exports = router;
