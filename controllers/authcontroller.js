const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { sendOTP, verifyOTP } = require('../config/otp');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/env');

exports.sendOtp = async (req, res) => {
  try {
    const { phoneNumber, countryCode = '+91' } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({ success: false, message: 'Phone number required' });
    }

    await sendOTP(`${countryCode}${phoneNumber}`);

    res.json({
      success: true,
      message: 'OTP sent successfully',
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { phoneNumber, countryCode = '+91', otp } = req.body;

    const isValid = await verifyOTP(`${countryCode}${phoneNumber}`, otp);
    if (!isValid) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }

    let user = await User.findOne({ phoneNumber });
    if (!user) {
      user = await User.create({ phoneNumber, countryCode });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({
      success: true,
      token,
      user,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
