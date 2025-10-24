import prisma from "../../../shared/prisma";
import { Request } from "express";

/**
 * Create availability for a specialist (with conflict prevention)
 */
const createAvailability = async (req: Request) => {
  const { specialistId, dayOfWeek, startTime, endTime } = req.body;

  if (!specialistId || dayOfWeek === undefined || !startTime || !endTime) {
    throw new Error("specialistId, dayOfWeek, startTime, and endTime are required");
  }

  const start = new Date(startTime);
  const end = new Date(endTime);

  if (start >= end) {
    throw new Error("Start time must be before end time");
  }

  // 🔍 Check for overlapping availability
  const conflict = await prisma.availability.findFirst({
    where: {
      specialistId,
      dayOfWeek: parseInt(dayOfWeek),
      OR: [
        {
          // Case 1: Existing slot starts before end time and ends after start time
          startTime: { lt: end },
          endTime: { gt: start },
        },
      ],
    },
  });

  if (conflict) {
    throw new Error("Availability conflict: Time slot overlaps with an existing one");
  }

  // ✅ Create new availability
  const availability = await prisma.availability.create({
    data: {
      specialistId,
      dayOfWeek: parseInt(dayOfWeek),
      startTime: start,
      endTime: end,
    },
  });

  return availability;
};

/**
 * Get availability by specialistId
 */
const getAvailabilityBySpecialist = async (specialistId: string) => {
  const availability = await prisma.availability.findMany({
    where: { specialistId },
    orderBy: { dayOfWeek: "asc" },
  });

  return availability;
};

export const availabilityService = {
  createAvailability,
  getAvailabilityBySpecialist,
};
