const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/adminSchema"); // Import Admin Schema
const router = express.Router();
require('dotenv').config();


// Admin Registration (One-time use)
// router.post("/register", async (req, res) => {
//   try {
//     const hashedPassword = await bcrypt.hash(req.body.password, 10);
//     const newAdmin = new Admin({
//       name:req.body.name,
//       email: req.body.email,
//       password: hashedPassword,
//     });
//     await newAdmin.save();
//     res.status(201).json({ message: "Admin registered successfully!" });
//   } catch (error) {
//     console.log("Error is ",error);
//     res.status(500).json({ error: "Failed to register admin" });
//   }
// });
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input fields
    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ error: "Admin already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new admin
    const newAdmin = new Admin({
      name,
      email,
      password: hashedPassword,
    });

    await newAdmin.save();
    res.status(201).json({ message: "Admin registered successfully!" });
  } catch (error) {
    console.error("Error registering admin:", error);
    res.status(500).json({ error: "Failed to register admin" });
  }
}); 

// Admin Login
router.post("/login", async (req, res) => {
  try {
    const admin = await Admin.findOne({ email: req.body.email });
    if (!admin) return res.status(404).json({ error: "Admin not found" });

    const isMatch = await bcrypt.compare(req.body.password, admin.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET || "manish", { expiresIn: "1d" });
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.log("error is ",error);
    res.status(500).json({ error: "Failed to login" });
  }
});

// Get Admin Profile (Protected Route)
// router.get("/profile", async (req, res) => {
//   try {
//     const token = req.headers.authorization;
//     if (!token) return res.status(401).json({ error: "Unauthorized" });

//     const decoded = jwt.verify(token, env.JWT_SECRET);
//     const admin = await Admin.findById(decoded.id).select("-password");
//     res.status(200).json(admin);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to fetch admin profile" });
//   }
// });

// router.put("/update/:id", async (req, res) => {
//   try {
//     const { title, description, image, link } = req.body;
//     const updatedProject = await Project.findByIdAndUpdate(
//       req.params.id,
//       { title, description, image, link },
//       { new: true }
//     );

//     if (!updatedProject) {
//       return res.status(404).json({ message: "Project not found" });
//     }
//     res.json(updatedProject);
//   } catch (error) {
//     res.status(500).json({ message: "Error updating project", error });
//   }
// });


module.exports = router;
