const Doctor = require('../models/doctor');
const User = require('../models/user');

exports.createDoctorProfile = async (req, res) => {
  try {
    const doctor = await Doctor.create({
      userId: req.user.id,
      ...req.body,
    });

    await User.findByIdAndUpdate(req.user.id, {
      role: 'doctor',
      doctorInfo: doctor._id,
    });

    res.status(201).json({
      success: true,
      message: 'Doctor profile created successfully',
      doctor,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getDoctors = async (req, res) => {
  const doctors = await Doctor.find().populate('userId');
  res.json({ success: true, doctors });
};
