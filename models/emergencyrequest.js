const mongoose = require('mongoose');

const emergencyRequestSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    description: String,
    status: {
      type: String,
      enum: ['requested', 'accepted', 'in_progress', 'resolved', 'cancelled'],
      default: 'requested',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('EmergencyRequest', emergencyRequestSchema);
