const EmergencyRequest = require('../models/emergencyrequest');

exports.createEmergency = async (req, res) => {
  const emergency = await EmergencyRequest.create({
    patientId: req.user.id,
    ...req.body,
  });

  res.status(201).json({ success: true, emergency });
};

exports.updateEmergencyStatus = async (req, res) => {
  const emergency = await EmergencyRequest.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );

  res.json({ success: true, emergency });
};
