const express = require("express");
const { getMessage, submitForm } = require("../controllers/contactControllers");
const router = express.Router();

// Submit Contact Form
router.post("/submit", submitForm);

// Get All Messages (For Admin)
router.get("/", getMessage);

module.exports = router;
