const express = require("express");
const { addResume, getResume, updateResume } = require("../controllers/resumeController");
const router = express.Router();

router.post("/", addResume); 
router.get("/", getResume); 
router.put("/", updateResume);

module.exports = router;
