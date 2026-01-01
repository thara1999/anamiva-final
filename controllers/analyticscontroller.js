const Analytics = require('../models/analytics');

exports.getDoctorAnalytics = async (req, res, next) => {
  try {
    const doctorId = req.user._id;

    const data = await Analytics.findOne({ doctor: doctorId });

    res.status(200).json({
      success: true,
      data: data || {}
    });
  } catch (error) {
    next(error);
  }
};
