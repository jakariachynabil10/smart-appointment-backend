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
  });

  const newSpecialist = await prisma.specialist.create({
    data: {
      name,
      email,
      specialty: specialty || null,
      profilePhoto : req.body.profilePhoto
    },
  });

  return { user: newUser, specialist: newSpecialist };
};


const getAllSpecialist = async () => {
  const specialists = await prisma.specialist.findMany({
    include: {
      availability: true, // optional — shows available slots
      appointments: true, // optional — shows assigned appointments
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return specialists;
};

export const specialistService = {
    createSpecialist,
    getAllSpecialist
}