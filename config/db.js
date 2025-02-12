require("dotenv").config();
const sql = require("mssql");

const config = {
  user: process.env.DB_USER || "sa",
  password: process.env.DB_PASSWORD || "admin@123",
  server: process.env.DB_SERVER || "localhost", 
  port: parseInt(process.env.DB_PORT) || 1500, 
  database: process.env.DB_NAME || "API",
  options: {
    encrypt: false, 
    trustServerCertificate: true,
  },
};

const connectDB = async () => {
  try {
    if (!sql.connected) {
      await sql.connect(config);
      console.log("✅ Database Connected");
    }
  } catch (err) {
    console.error("❌ Database Connection Failed:", err.message);
  }
};

module.exports = { connectDB, sql };