const Appointment = require('../models/appointment');
const Doctor = require('../models/doctor');

/* =========================
   BOOK APPOINTMENT
========================= */
exports.createAppointment = async (req, res) => {
  try {
    const { doctorId, date, time, type, symptoms } = req.body;

    // Check if slot is available
    const existing = await Appointment.findOne({ doctorId, date, time });
    if (existing) return res.status(409).json({ success: false, message: 'Time slot already booked' });

    const appointment = await Appointment.create({
      patientId: req.user.id,
      doctorId,
      date,
      time,
      type,
      symptoms,
    });

    res.status(201).json({ success: true, appointment, message: 'Appointment booked successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =========================
   GET APPOINTMENTS
========================= */
exports.getAppointments = async (req, res) => {
  try {
    const { status, startDate, endDate, page = 1, limit = 20 } = req.query;

    const filter = {};

    if (req.user.role === 'patient') filter.patientId = req.user.id;
    if (req.user.role === 'doctor') filter.doctorId = req.user.id;

    if (status) filter.status = status;
    if (startDate || endDate) filter.date = {};
    if (startDate) filter.date.$gte = new Date(startDate);
    if (endDate) filter.date.$lte = new Date(endDate);

    const total = await Appointment.countDocuments(filter);
    const appointments = await Appointment.find(filter)
      .populate('doctorId')
      .populate('patientId')
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ date: 1, time: 1 });

    res.json({
      success: true,
      appointments,
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =========================
   GET APPOINTMENT BY ID
========================= */
exports.getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.appointmentId)
      .populate('doctorId')
      .populate('patientId');

    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });

    res.json({ success: true, appointment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =========================
   UPDATE STATUS (Doctor Only)
========================= */
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findById(req.params.appointmentId);

    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });
    if (req.user.role !== 'doctor' || appointment.doctorId.toString() !== req.user.id)
      return res.status(403).json({ success: false, message: 'Not authorized' });

    appointment.status = status;
    await appointment.save();

    res.json({ success: true, appointment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =========================
   CANCEL APPOINTMENT
========================= */
exports.cancelAppointment = async (req, res) => {
  try {
    const { reason } = req.body;
    const appointment = await Appointment.findById(req.params.appointmentId);

    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });

    // Check if user is doctor or patient
    if (req.user.role === 'patient' && appointment.patientId.toString() !== req.user.id)
      return res.status(403).json({ success: false, message: 'Not authorized' });
    if (req.user.role === 'doctor' && appointment.doctorId.toString() !== req.user.id)
      return res.status(403).json({ success: false, message: 'Not authorized' });

    // Must cancel 24h before appointment
    if (new Date() > new Date(appointment.date).getTime() - 24 * 60 * 60 * 1000)
      return res.status(400).json({ success: false, message: 'Cannot cancel less than 24 hours before appointment' });

    appointment.status = 'cancelled';
    appointment.cancelReason = reason;
    appointment.refund = { amount: 800, status: 'pending' }; // example

    await appointment.save();
    res.json({ success: true, appointment, refund: appointment.refund });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =========================
   RESCHEDULE APPOINTMENT
========================= */
exports.rescheduleAppointment = async (req, res) => {
  try {
    const { date, time } = req.body;
    const appointment = await Appointment.findById(req.params.appointmentId);

    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });

    if (req.user.role !== 'patient' || appointment.patientId.toString() !== req.user.id)
      return res.status(403).json({ success: false, message: 'Not authorized' });

    // Check if new slot is available
    const existing = await Appointment.findOne({ doctorId: appointment.doctorId, date, time });
    if (existing) return res.status(409).json({ success: false, message: 'Time slot already booked' });

    appointment.date = date;
    appointment.time = time;
    await appointment.save();

    res.json({ success: true, appointment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =========================
   ADD CLINICAL NOTES
========================= */
exports.addNotes = async (req, res) => {
  try {
    const { notes, diagnosis } = req.body;
    const appointment = await Appointment.findById(req.params.appointmentId);

    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });

    if (req.user.role !== 'doctor' || appointment.doctorId.toString() !== req.user.id)
      return res.status(403).json({ success: false, message: 'Not authorized' });

    appointment.notes = notes;
    appointment.diagnosis = diagnosis;
    await appointment.save();

    res.json({ success: true, appointment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
