const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },

    role: {
      type: String,
      enum: ["patient", "doctor", "admin", "nurse"],
      default: "patient",
    },

    name: {
      type: String,
    },

    email: {
      type: String,
    },

    isProfileCompleted: {
      type: Boolean,
      default: false,
    },

    // ⭐ Doctor Favorites
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.models.User || mongoose.model("User", userSchema);
