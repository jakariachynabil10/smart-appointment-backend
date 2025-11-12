import bcrypt from "bcryptjs";
import { fileUploader } from "../../../helpers/fileUploder";
import prisma from "../../../shared/prisma";
import { Role } from "../../../../generated/prisma";
import { Request } from "express";
import { IAuthUser } from "./user.interface";

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

  return newUser;
};

/**
 * Get all users (no passwords)
 */
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

/**
 * Get logged-in user's profile (no password)
 */
const getMyProfile = async (user: IAuthUser) => {
  if (!user?.email) throw new Error("Invalid user");

  let userInfo;

  if (user.role === Role.SPECIALIST) {
    userInfo = await prisma.specialist.findUniqueOrThrow({
      where: { email: user.email },
      include: {
        appointments: {
          include: {
            user: true,
          },
        },
      },
    });
  } else {
    userInfo = await prisma.user.findUniqueOrThrow({
      where: { email: user.email },
      include: {
        appointments: {
          include: {
            specialist: true,
          },
        },
      },
    });
  }

  // remove password field if it exists
  if ("password" in userInfo) {
    delete (userInfo as any).password;
  }

  return userInfo;
};

/**
 * Delete user (with cascade handling)
 */
const deleteUserById = async (id: string) => {
  const user = await prisma.user.findUniqueOrThrow({ where: { id } });

  if (user.role === Role.SPECIALIST) {
    const specialist = await prisma.specialist.findUnique({
      where: { email: user.email },
    });

    if (specialist) {
      await prisma.appointment.deleteMany({
        where: { specialistId: specialist.id },
      });

      await prisma.availability.deleteMany({
        where: { specialistId: specialist.id },
      });

      await prisma.service.deleteMany({
        where: { specialistId: specialist.id },
      });

      await prisma.specialist.delete({
        where: { id: specialist.id },
      });
    }
  }

  await prisma.appointment.deleteMany({
    where: { userId: id },
  });

  const result = await prisma.user.delete({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      profilePhoto: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return result;
};

export const userService = {
  createAdmin,
  createUser,
  getAllFromDB,
  getMyProfile,
  deleteUserById,
};
