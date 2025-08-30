const Resume = require("../models/resumeSchema");

// Add new resume (only one allowed)
const addResume = async (req, res) => {
  try {
    // First delete old one if exists
    await Resume.deleteMany({});
    const resume = new Resume(req.body);
    await resume.save();
    res.status(201).json({ success: true, data: resume });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get resume (for frontend)
const getResume = async (req, res) => {
  try {
    const resume = await Resume.findOne();
    res.status(200).json({ success: true, data: resume });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update resume (replace link)
const updateResume = async (req, res) => {
  try {
    const resume = await Resume.findOne();
    if (!resume) return res.status(404).json({ success: false, message: "Resume not found" });

    resume.link = req.body.link;
    await resume.save();

    res.status(200).json({ success: true, data: resume });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = { addResume, getResume, updateResume };
