import { Request } from "express";
import prisma from "../../../shared/prisma";
import { AppointmentStatus } from "../../../../generated/prisma";


const createAppointment = async (req: Request) => {
  const { userId, specialistId, serviceId, date, startTime, endTime } = req.body;

  // ✅ Check if specialist already booked at that time
  const overlapping = await prisma.appointment.findFirst({
    where: {
      specialistId,
      date: new Date(date),
      OR: [
        {
          startTime: { lte: new Date(endTime) },
          endTime: { gte: new Date(startTime) },
        },
      ],
    },
  });

  if (overlapping) {
    throw new Error("The specialist is already booked during this time slot");
  }

  const appointment = await prisma.appointment.create({
    data: {
      userId,
      specialistId,
      serviceId,
      date: new Date(date),
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      status: AppointmentStatus.PENDING,
    },
    include: {
      user: {
        select : {
            id : true,
            email : true,
            name : true,
        }
      },
      specialist: true,
      service: true,
    },
  });

  return appointment;
};

const getUserAppointments = async (userId: string) => {
  return await prisma.appointment.findMany({
    where: { userId },
    include: {
      specialist: true,
      service: true,
    },
  });
};

const updateAppointmentStatus = async (req: Request) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!Object.values(AppointmentStatus).includes(status)) {
    throw new Error("Invalid appointment status");
  }

  const appointment = await prisma.appointment.update({
    where: { id },
    data: { status },
  });

  return appointment;
};

export const appointmentService = {
  createAppointment,
  getUserAppointments,
  updateAppointmentStatus,
};
