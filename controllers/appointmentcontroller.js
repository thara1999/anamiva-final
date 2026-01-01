const Appointment = require('../models/appointment');

exports.createAppointment = async (req, res) => {
  const appointment = await Appointment.create({
    patientId: req.user.id,
    ...req.body,
  });

  res.status(201).json({ success: true, appointment });
};

exports.getAppointments = async (req, res) => {
  const appointments = await Appointment.find({
    patientId: req.user.id,
  }).populate('doctorId');

  res.json({ success: true, appointments });
};
