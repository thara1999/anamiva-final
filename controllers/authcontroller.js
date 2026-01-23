const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { sendOTP, verifyOTP } = require("../config/otp");
const { JWT_SECRET, JWT_EXPIRES_IN } = require("../config/env");

/* =====================
   SEND OTP
===================== */
exports.sendOtp = async (req, res) => {
  const { phone } = req.body;

  if (!phone)
    return res.status(400).json({
      success: false,
      message: "Phone required"
    });

  await sendOTP(phone);

  res.json({
    success: true,
    message: `OTP sent successfully to ${phone}`
  });
};

/* =====================
   VERIFY OTP
===================== */
exports.verifyOtp = async (req, res) => {
  const { phone, otp } = req.body;

  if (!phone || !otp)
    return res.status(400).json({
      success: false,
      message: "Phone & OTP required"
    });

  const valid = await verifyOTP(phone, otp);
  if (!valid)
    return res.status(400).json({
      success: false,
      message: "Invalid or expired OTP"
    });

  let user = await User.findOne({ phoneNumber: phone });

  // EXISTING USER
  if (user && user.isProfileCompleted) {
    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return res.json({
      success: true,
      user,
      isNewUser: false,
      token
    });
  }

  // NEW USER
  const tempToken = jwt.sign(
    { phone, isTemp: true },
    JWT_SECRET,
    { expiresIn: "50m" }
  );

  res.json({
    success: true,
    isNewUser: true,
    phone,
    tempToken
  });
};

/* =====================
   SELECT ROLE
===================== */
exports.selectRole = async (req, res) => {
  const { role } = req.body;
  const phone = req.user.phone;

  if (!["patient", "doctor"].includes(role))
    return res.status(400).json({ message: "Invalid role" });

  await User.findOneAndUpdate(
    { phoneNumber: phone },
    { role },
    { upsert: true }
  );

  res.json({
    success: true,
    role,
    phone
  });
};

/* =====================
   COMPLETE PROFILE
===================== */
exports.completeProfile = async (req, res) => {
  const phone = req.user.phone;

  const user = await User.findOneAndUpdate(
    { phoneNumber: phone },
    {
      ...req.body,
      isProfileCompleted: true
    },
    { new: true }
  );

  const token = jwt.sign(
    { id: user._id, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  res.status(201).json({
    success: true,
    user,
    token
  });
};

/* =====================
   GET ME
===================== */
exports.getMe = async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json({ success: true, user });
};

/* =====================
   LOGOUT
===================== */
exports.logout = async (req, res) => {
  res.json({ success: true, message: "Logged out successfully" });
};

/* =====================
   UPDATE PROFILE
===================== */
exports.updateProfile = async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user.id,
    req.body,
    { new: true }
  );

  res.json({ success: true, user });
};
