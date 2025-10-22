import bcrypt from "bcryptjs";
import { fileUploader } from "../../../helpers/fileUploder";
import prisma from "../../../shared/prisma";
import { Role } from "../../../../generated/prisma";
import { Request } from "express";

/**
 * Create ADMIN
 */
const createAdmin = async (req: Request) => {
  const { name, email, password } = req.body;
  

  const file: any = req.file;

  if (file) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    req.body.profilePhoto = uploadToCloudinary?.secure_url;
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) throw new Error("User with this email already exists");

  const hashedPassword = await bcrypt.hash(password, 10);

  const newAdmin = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      profilePhoto: req.body.profilePhoto,
      role: Role.ADMIN,
    },
  });

  return newAdmin;
};

/**
 * Create REGULAR USER
 */
const createUser = async (req: Request) => {
  const { name, email, password } = req.body;

  const file: any = req.file;

  if (file) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    req.body.profilePhoto = uploadToCloudinary?.secure_url;
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) throw new Error("User with this email already exists");

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      profilePhoto: req.body.profilePhoto,
      role: Role.USER,
    },
  });

  return newUser;
};

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
    },
  });

  return { user: newUser, specialist: newSpecialist };
};

const getAllFromDB = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      profilePhoto: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return users;
};

export const userService = {
  createAdmin,
  createUser,
  createSpecialist,
  getAllFromDB,
};
