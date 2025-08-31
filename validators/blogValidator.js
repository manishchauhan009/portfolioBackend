const { body, validationResult } = require("express-validator");

const validateBlog = [
  body("title").notEmpty().withMessage("Title is required"),
  body("description").notEmpty().withMessage("Description is required"),
  body("content").notEmpty().withMessage("Content is required"),
  body("image.url").notEmpty().withMessage("Image URL required"),
  body("image.public_id").notEmpty().withMessage("Image public_id required"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = { validateBlog };
