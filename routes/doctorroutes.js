const express = require("express");
const router = express.Router();
const doctorController = require("../controllers/doctorcontroller");
const protect = require("../middlewares/authmiddleware");

/* Doctor public */
router.get("/", doctorController.getDoctors);
router.get("/:doctorId", doctorController.getDoctorById);
router.get("/:doctorId/availability", doctorController.getDoctorAvailability);

/* Doctor protected */
router.post("/create", protect, doctorController.createDoctorProfile);
router.post("/:doctorId/favorite", protect, doctorController.toggleFavorite);
router.get("/favorites/me", protect, doctorController.getFavorites);

module.exports = router;
