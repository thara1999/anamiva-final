const MedicalRecord = require('../models/medicalrecord');

exports.createMedicalRecord = async (req, res) => {
  const record = await MedicalRecord.create({
    patientId: req.user.id,
    ...req.body,
  });

  res.status(201).json({ success: true, record });
};

exports.getMedicalRecords = async (req, res) => {
  const records = await MedicalRecord.find({ patientId: req.user.id });
  res.json({ success: true, records });
};
