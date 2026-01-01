const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    speciality: { type: String, required: true },
    degree: { type: String, required: true },
    registrationNo: { type: String, required: true },
    experience: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    clinicInfo: {
      name: String,
      address: String,
      hours: String,
    },
    availability: {
      online: { type: Boolean, default: false },
      clinicOpen: { type: Boolean, default: false },
      acceptEmergency: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Doctor', doctorSchema);
