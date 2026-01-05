const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    type: { type: String, enum: ['online', 'clinic'], default: 'online' },
    symptoms: String,
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled', 'no_show'],
      default: 'pending',
    },
    notes: String,
    diagnosis: String,
    cancelReason: String,
    refund: {
      amount: Number,
      status: { type: String, enum: ['pending', 'processed'], default: 'pending' },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Appointment', appointmentSchema);
