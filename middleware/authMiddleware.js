require("dotenv").config();
const jwt = require("jsonwebtoken");

// Helper function to extract token from headers or cookies
const extractToken = (req) => {
  return req.headers["authorization"]?.split(" ")[1] || req.cookies.token;
};

// Authentication middleware
const authMiddleware = async (req, res, next) => {
  const token = extractToken(req);

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Access Denied. No Token Provided." });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;  // Attach user info to request object
    next();
  } catch (error) {
    console.error("Authentication Error:", error);
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "Token expired. Please login again." });
    }
    return res.status(400).json({ success: false, message: "Invalid Token" });
  }
};

// Authorization middleware for admin access
const isAdmin = async (req, res, next) => {
  const token = extractToken(req);

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Access Denied. No Token Provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You are not authorized to access this resource.",
      });
    }

    req.user = decoded;  // Attach decoded token to request object
    next();
  } catch (error) {
    console.error("Authorization Error:", error);
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "Token expired. Please login again." });
    }
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = { authMiddleware, isAdmin };
