require("dotenv").config();
const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  return jwt.sign({ id: user.id, mobileNumber: user.mobileNumber }, process.env.JWT_SECRET||'0c255bbcc08cc845f8ef3048569d633e965022cbdd333795c61f76e91c7b446fdc8bdc2c4d6b6376c5e80f81fbfcac3e727a9c9b632b73b79d40d9805692287a', { expiresIn: "1h" });
};

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ message: "Access Denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid Token" });
  }
};

module.exports = { generateToken, verifyToken };