const Joi = require("joi");

const otpSchema = Joi.object({
  mobile: Joi.string().min(10).max(15).required(),
});

const verifyOtpSchema = Joi.object({
  mobile: Joi.string().min(10).max(15).required(),
  otp: Joi.string().length(6).required(),
});

module.exports = { otpSchema, verifyOtpSchema };