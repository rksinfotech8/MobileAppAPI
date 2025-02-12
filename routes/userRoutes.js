const express = require("express");
const bcrypt = require("bcrypt");
const twilio = require("twilio");
// const {} = require('mssql');
const { generateToken } = require("../middlewares/authMiddleware");
const { findUserByMobile, registerUser, ForgotPassword } = require("../model/userModels");
require("dotenv").config();
const { sql } = require("../config/db");
const router = express.Router();

const twilioClient = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Login Route
router.post("/login", async (req, res) => {
  const { mobileNumber, password } = req.body;

  try {
    console.log("Login request received for:", mobileNumber);
    const user = await findUserByMobile(mobileNumber);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.Password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user);
    res.json({ message: "Login successful", token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Register Route
router.post("/register", async (req, res) => {
  const { mobileNumber, password } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const isRegistered = await registerUser(mobileNumber, hashedPassword);
    if (isRegistered) {
      res.status(201).json({ message: "User registered successfully" });
    } else {
      res.status(500).json({ message: "Registration failed" });
    }
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Send OTP Route
router.post("/send-otp", async (req, res) => {
  const { mobileNumber } = req.body;
  try {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await twilioClient.messages.create({
      body: `Your OTP code is ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: mobileNumber
    });
    res.json({ message: "OTP sent successfully", otp });
  } catch (err) {
    console.error("OTP sending error:", err);
    res.status(500).json({ message: "Failed to send OTP", error: err.message });
  }
});

// Forgot Password Route
router.post("/forgotpassword", async (req, res) => {
  const { MobileNumber, NewPassword, ConfirmPassword } = req.body;

  try {
    if (NewPassword !== ConfirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(NewPassword, salt);

    // Fetch user details using MobileNumber
    const userQuery = await sql.query`SELECT Id, Password FROM Users WHERE MobileNumber = ${MobileNumber}`;

    if (userQuery.recordset.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const userId = userQuery.recordset[0].Id;
    const oldPassword = userQuery.recordset[0].Password;

    // Call the corrected ForgotPassword function
    await ForgotPassword(userId, hashedPassword, oldPassword);

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


module.exports = router;