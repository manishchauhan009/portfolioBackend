const express = require("express");
const cors = require("cors");
const dbConnect = require("./config/databaseConnection");
const contactRoutes=require('./routes/contactRoutes');
const projectRoutes=require('./routes/projectRoutes');
const adminRoutes=require('./routes/adminRoutes');
const blogRoutes=require('./routes/blogRoutes');
const resumeRoutes=require('./routes/resumeRoutes')
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const cookieParser = require("cookie-parser");
require("dotenv").config();



const PORT = process.env.PORT || 4000;
const app = express();

const allowedOrigins = process.env.FRONTEND_URLS.split(",");

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


app.use(express.json());
app.use(cookieParser());

app.use("/api/contacts", contactRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/resume", resumeRoutes);

app.use(notFound);
app.use(errorHandler);

dbConnect()
  .then(() => {
    console.log("Database connected!");
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err.message);
  });
