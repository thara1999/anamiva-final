const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    phoneNumber: { type: String, required: true, unique: true },
    countryCode: { type: String, default: '+91' },
    name: { type: String },
    role: {
      type: String,
      enum: ['admin', 'doctor', 'patient', 'nurse'],
      default: 'patient',
    },
    profilePicture: { type: String },
    doctorInfo: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
