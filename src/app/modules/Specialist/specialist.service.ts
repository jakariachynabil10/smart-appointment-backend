import { Request } from "express";
import { Role } from "../../../../generated/prisma";
import { fileUploader } from "../../../helpers/fileUploder";
import prisma from "../../../shared/prisma";
import bcrypt from "bcryptjs";

/**
 * Create SPECIALIST
 * - Adds record in User table (role = SPECIALIST)
 * - Adds record in Specialist table
 */
const createSpecialist = async (req: Request) => {
  const { name, email, password, specialty } = req.body;

  const file: any = req.file;

  if (file) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    req.body.profilePhoto = uploadToCloudinary?.secure_url;
  }



  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) throw new Error("User with this email already exists");

  const existingSpecialist = await prisma.specialist.findUnique({
    where: { email },
  });
  if (existingSpecialist)
    throw new Error("Specialist with this email already exists");

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      profilePhoto: req.body.profilePhoto,
      role: Role.SPECIALIST,
    },
     select: {
      id: true,
      name: true,
      email: true,
      profilePhoto: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  const newSpecialist = await prisma.specialist.create({
    data: {
      name,
      email,
      specialty: specialty || null,
      profilePhoto: req.body.profilePhoto,
    },
     select: {
      id: true,
      name: true,
      email: true,
      profilePhoto: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return { user: newUser, specialist: newSpecialist };
};

/**
 * Get All Specialists
 */
const getAllSpecialist = async () => {
  const specialists = await prisma.specialist.findMany({
    include: {
      availability: true,
      appointments: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return specialists;
};

/**
 * Get Appointments by Specialist ID
 */
const getAppointmentBySpecialistID = async (specialistId: string) => {
  // Check if specialist exists
  const specialist = await prisma.specialist.findUnique({
    where: { id: specialistId },
  });

  if (!specialist) throw new Error("Specialist not found");

  // Fetch all appointments of that specialist
  const appointments = await prisma.appointment.findMany({
    where: { specialistId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          profilePhoto: true,
        },
      },
      specialist: {
        select: {
          id: true,
          name: true,
          specialty: true,
          profilePhoto: true,
        },
      },
      service : true
    },
    orderBy: {
      date: "desc",
    },
  });

  return {
    specialist,
    totalAppointments: appointments.length,
    appointments,
  };
};

export const specialistService = {
  createSpecialist,
  getAllSpecialist,
  getAppointmentBySpecialistID,
};
