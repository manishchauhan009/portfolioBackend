const express = require("express");
const { adminRegister, adminLogin } = require("../controllers/adminControllers");
const router = express.Router();
require('dotenv').config();

router.post("/register", adminRegister); 
router.post("/login", adminLogin);

module.exports = router;
