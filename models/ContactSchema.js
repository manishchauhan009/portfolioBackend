const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema(
  {
    user_name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [3, "Name should have at least 3 characters"],
    },
    user_email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
        "Please enter a valid email address",
      ],
    },
    user_phone: {
      type: String,
      required: [true, "Phone number is required"],
      match: [/^[6-9]\d{9}$/, "Please enter a valid 10-digit phone number"],
    },
    user_subject: {
      type: String,
      required: [true, "Subject is required"],
      minlength: [5, "Subject should have at least 5 characters"],
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      minlength: [10, "Message should have at least 10 characters"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Contact = mongoose.model("Contact", ContactSchema);
module.exports = Contact;
