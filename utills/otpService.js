const twilio = require("twilio");
require("dotenv").config();

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const sendOTP = async (mobile, otp) => {
  try {
    await client.messages.create({
      body: `Your OTP code is ${otp}. It expires in 10 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: mobile,
    });
    console.log(`✅ OTP sent to ${mobile}`);
  } catch (err) {
    console.error("❌ Error sending OTP:", err.message);
  }
};

module.exports = { sendOTP };
