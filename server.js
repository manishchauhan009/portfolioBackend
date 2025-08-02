const express = require("express");
const cors = require("cors");
const dbConnect = require("./config/databaseConnection");
const contactRoutes=require('./routes/contactRoutes');
const projectRoutes=require('./routes/projectRoutes');
const adminRoutes=require('./routes/adminRoutes');
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const cookieParser = require("cookie-parser");
require("dotenv").config();


const PORT = process.env.PORT || 4000;
const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
// app.use(cors());

app.use(express.json());
app.use(cookieParser());

app.use("/api/contacts", contactRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/admin", adminRoutes);


app.get("/", (req, res) => {
  res.status(200).send("Server is up and running!");
});

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
