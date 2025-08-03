const express = require("express");
const { getMessage, submitForm, getMessageCount } = require("../controllers/contactControllers");
const router = express.Router();

// Submit Contact Form
router.post("/submit", submitForm);

// Get All Messages (For Admin)
router.get("/", getMessage);
router.get('/count', getMessageCount);


module.exports = router;
