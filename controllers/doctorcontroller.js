const Doctor = require("../models/doctor");
const User = require("../models/user");

/* =========================
   CREATE DOCTOR PROFILE
========================= */
exports.createDoctorProfile = async (req, res) => {
  const doctor = await Doctor.create({
    userId: req.user.id,
    ...req.body
  });

  await User.findByIdAndUpdate(req.user.id, {
    role: "doctor",
    doctorInfo: doctor._id
  });

  res.status(201).json({
    success: true,
    message: "Doctor profile created successfully",
    doctor
  });
};

/* =========================
   GET DOCTORS (SEARCH + FILTER)
========================= */
exports.getDoctors = async (req, res) => {
  const {
    query,
    specialization,
    availableNow,
    acceptingEmergency,
    sortBy = "rating",
    page = 1,
    limit = 20
  } = req.query;

  const filter = {};

  if (specialization) filter.speciality = specialization;

  if (availableNow)
    filter["availability.online"] = availableNow === "true";

  if (acceptingEmergency)
    filter["availability.acceptEmergency"] = acceptingEmergency === "true";

  if (query) {
    filter.$or = [
      { speciality: new RegExp(query, "i") }
    ];
  }

  const skip = (page - 1) * limit;

  const doctors = await Doctor.find(filter)
    .populate("userId", "name profilePicture")
    .sort({ [sortBy]: -1 })
    .skip(skip)
    .limit(Number(limit));

  const total = await Doctor.countDocuments(filter);

  res.json({
    success: true,
    doctors,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / limit)
    }
  });
};

/* =========================
   GET DOCTOR BY ID
========================= */
exports.getDoctorById = async (req, res) => {
  const doctor = await Doctor.findById(req.params.doctorId).populate(
    "userId",
    "name profilePicture"
  );

  if (!doctor)
    return res.status(404).json({ success: false, message: "Doctor not found" });

  res.json({ success: true, doctor });
};

/* =========================
   DOCTOR AVAILABILITY
========================= */
exports.getDoctorAvailability = async (req, res) => {
  const { date } = req.query;

  if (!date)
    return res.status(400).json({ success: false, message: "Date required" });

  const slots = [
    { time: "09:00", available: true },
    { time: "09:30", available: false },
    { time: "10:00", available: true },
    { time: "10:30", available: true }
  ];

  res.json({
    success: true,
    date,
    slots
  });
};

/* =========================
   TOGGLE FAVORITE
========================= */
exports.toggleFavorite = async (req, res) => {
  const user = await User.findById(req.user.id);

  const doctorId = req.params.doctorId;
  const index = user.favorites.indexOf(doctorId);

  let isFavorite;

  if (index === -1) {
    user.favorites.push(doctorId);
    isFavorite = true;
  } else {
    user.favorites.splice(index, 1);
    isFavorite = false;
  }

  await user.save();

  res.json({
    success: true,
    isFavorite,
    message: isFavorite
      ? "Doctor added to favorites"
      : "Doctor removed from favorites"
  });
};

/* =========================
   GET FAVORITES
========================= */
exports.getFavorites = async (req, res) => {
  const user = await User.findById(req.user.id).populate({
    path: "favorites",
    populate: { path: "userId", select: "name profilePicture" }
  });

  res.json({
    success: true,
    doctors: user.favorites
  });
};
