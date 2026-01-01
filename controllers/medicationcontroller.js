const Medication = require('../models/medication');

exports.addMedication = async (req, res) => {
  const medication = await Medication.create(req.body);
  res.status(201).json({ success: true, medication });
};

exports.getMedications = async (req, res) => {
  const medications = await Medication.find({ patientId: req.user.id });
  res.json({ success: true, medications });
};
