const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const { connectDB } = require("./config/db");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const authRoutes = require("./routes/userRoutes");
const siteRoutes = require("./routes/siteHeadRoutes");
const managerRoutes = require("./routes/reportManagerRoutes");
const contractorRoutes = require("./routes/contractorRoutes");
const workerRoutes = require("./routes/workerRoutes");
const fieldRoutes = require("./routes/fieldRoutes");
const fieldStateRoutes = require("./routes/fieldStateRoutes");
const workRoutes = require("./routes/workRoutes");
const shiftRoutes = require("./routes/shiftRoutes");

const app = express();

// 🔹 Middleware Setup
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// 🔹 Connect Database
connectDB();

// 🔹 Ensure 'uploads' folder exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true }); // Recursive ensures parent directories exist
}

// 🔹 Multer Storage Configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
});
const upload = multer({ storage: storage });

// 🔹 Routes
app.use("/api/auth", authRoutes);
app.use("/api", siteRoutes);
app.use("/api", managerRoutes);
app.use("/api", contractorRoutes);
app.use("/api", workerRoutes);
app.use("/api", fieldRoutes);
app.use("/api", fieldStateRoutes);
app.use("/api", workRoutes);
app.use("/api", shiftRoutes);

// 🔹 Serve Static Files (Uploaded Images)
app.use("/uploads", express.static("uploads"));

// 🔹 Global Middleware Logger
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// 🔹 Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

module.exports = app; // No need to export router, export the app instead
