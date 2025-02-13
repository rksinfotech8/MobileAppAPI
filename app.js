const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const { connectDB } = require("./config/db");
var router = express.Router();
const jwt = require("jsonwebtoken");
const path = require('path');
const fs = require('fs');

const authRoutes = require("./routes/userRoutes");
const siteRoutes = require ('./routes/siteHeadRoutes');
const managerRoutes = require('./routes/reportManagerRoutes');
const contractorRoutes = require('./routes/contractorRoutes');
const workerRoutes = require('./routes/workerRoutes');
const fieldRoutes = require('./routes/fieldRoutes');
const fieldStateRoutes = require('./routes/fieldStateRoutes');
const workRoutes = require('./routes/workRoutes');
const shiftRoutes = require('./routes/shiftRoutes');

const app = express();
app.use(cors());
app.use(bodyParser.json());


connectDB();

app.use("/api/auth", authRoutes);
app.use('/api', siteRoutes);
app.use('/api', managerRoutes);
app.use('/api', contractorRoutes);
app.use('/api', workerRoutes);
app.use('/api', fieldRoutes);
app.use('/api', fieldStateRoutes);
app.use('api', workRoutes);
app.use('api', shiftRoutes);

app.use('/uploads', express.static('uploads'));

router.use((request,response,next)=>{
  console.log('middleware');
  next();
});

const uploadsDir = path.join(__dirname, 'uploads');

// Check if the 'uploads' folder exists
if (!fs.existsSync(uploadsDir)) {
    // If it doesn't exist, create the folder
    fs.mkdirSync(uploadsDir);
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = router;