const { sql } = require("../config/db");

const findUserByMobile = async (mobileNumber) => {
  try {
    const result = await sql.query`SELECT * FROM Users WHERE MobileNumber = ${mobileNumber}`;
    if (result.recordset.length === 0) {
      return null; // No user found
    }
    return result.recordset[0];
  } catch (err) {
    console.error("Query Error:", err.message);
    throw new Error("Database query failed");
  }
};

const registerUser = async (mobileNumber, password) => {
  try {
    await sql.query`INSERT INTO Users (MobileNumber, Password) VALUES (${mobileNumber}, ${password})`;
    return true;
  } catch (err) {
    console.error("Insert Error:", err.message);
    throw new Error("User registration failed");
  }
};


const ForgotPassword = async (userId, NewPassword, ConfirmPassword) => {
  try {
    await sql.query`
      INSERT INTO Password_Resets (UserId, NewPassword, ConfirmPassword)
      VALUES (${userId}, ${NewPassword}, ${ConfirmPassword})
    `;
    return true;
  } catch (err) {
    console.error("Insert Error:", err.message);
    throw new Error("Reset Password failed");
  }
};



module.exports = { findUserByMobile, registerUser, ForgotPassword};