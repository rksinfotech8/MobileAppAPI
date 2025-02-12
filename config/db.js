require("dotenv").config();
const sql = require("mssql");

const config = {
  user: process.env.DB_USER || "apsar11_",
  password: process.env.DB_PASSWORD || "admin@123",
  server: process.env.DB_SERVER || "sql.bsite.net\\MSSQL2016", 
  port: process.env.DB_PORT, 
  database: process.env.DB_NAME || "apsar11_",
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