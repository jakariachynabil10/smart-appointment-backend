import express from "express";
import { availabilityController } from "./availability.controller";
import auth from "../../middleware/auth";
import { Role } from "../../../../generated/prisma";

const router = express.Router();

// Only specialists (or admin) can create availability
router.post("/create-availability", auth(Role.SPECIALIST, Role.ADMIN, Role.SUPERADMIN), availabilityController.createAvailability);

// Public or authenticated users can view availability
router.get("/:specialistId", availabilityController.getAvailabilityBySpecialist);

export const availabilityRoutes = router;
