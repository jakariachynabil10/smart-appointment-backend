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


const getMyProfile = async (user: IAuthUser) => {
  if (!user?.email) throw new Error("Invalid user");

  let userInfo;

  if (user.role === Role.SPECIALIST) {
    // Fetch specialist data
    userInfo = await prisma.specialist.findUniqueOrThrow({
      where: { email: user.email },
      include: {
        appointments: {
          include: {
            user: true, // get user info for each appointment
          },
        },
      },
    });
  } else {
    // Fetch regular user data
    userInfo = await prisma.user.findUniqueOrThrow({
      where: { email: user.email },
      include: {
        appointments: {
          include: {
            specialist: true, // get specialist info for each appointment
          },
        },
      },
    });
  }

  return userInfo;
};


const deleteUserById = async (id: string) => {
  // 1️⃣ Find the user
  const user = await prisma.user.findUniqueOrThrow({ where: { id } });

  if (user.role === Role.SPECIALIST) {
    // 2️⃣ Find the specialist by email
    const specialist = await prisma.specialist.findUnique({
      where: { email: user.email },
    });

    if (specialist) {
      // 3️⃣ Delete all related appointments first
      await prisma.appointment.deleteMany({
        where: { specialistId: specialist.id },
      });

      // 4️⃣ Delete all availability slots linked to this specialist
      await prisma.availability.deleteMany({
        where: { specialistId: specialist.id },
      });

      // 5️⃣ Delete all services created by this specialist
      await prisma.service.deleteMany({
        where: { specialistId: specialist.id },
      });

      // 6️⃣ Finally, delete the specialist record
      await prisma.specialist.delete({
        where: { id: specialist.id },
      });
    }
  }

  // 7️⃣ Delete all appointments linked to this user (if user had any)
  await prisma.appointment.deleteMany({
    where: { userId: id },
  });

  // 8️⃣ Finally, delete the user
  const result = await prisma.user.delete({ where: { id } });

  return result;
};




export const userService = {
  createAdmin,
  createUser,
  getAllFromDB,
  getMyProfile,
  deleteUserById
};
