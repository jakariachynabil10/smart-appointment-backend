import express from "express";
import { appointmentController } from "./appointment.controller";
import auth from "../../middleware/auth";


const router = express.Router();

// ✅ Create Appointment (User only)
router.post("/create-appointment", auth(), appointmentController.createAppointment);

// ✅ Get all appointments for a specific user
router.get("/:id", auth(), appointmentController.getUserAppointments);

// ✅ Update appointment status (Admin/Specialist only)
router.patch("/:id", auth(), appointmentController.updateAppointmentStatus);

export const appointmentRoutes = router;
