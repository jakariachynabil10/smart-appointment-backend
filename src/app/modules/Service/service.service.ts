import prisma from "../../../shared/prisma";
import { Request } from "express";

/**
 * Create a new service
 * (Admin creates a service under a specific specialist)
 */
const createService = async (req: Request) => {
  const { name, description, duration, price, specialistId } = req.body;

  if (!name || !duration || !specialistId) {
    throw new Error("Name, duration, and specialistId are required");
  }

  // check if specialist exists
  const specialist = await prisma.specialist.findUnique({
    where: { id: specialistId },
  });

  if (!specialist) {
    throw new Error("Invalid specialist ID");
  }

  const newService = await prisma.service.create({
    data: {
      name,
      description,
      duration: parseInt(duration),
      price: price ? parseFloat(price) : null,
      specialistId: specialistId,
    },
    include: {
     specialist : true
    },
  });

  return newService;
};

/**
 * Get all services (with specialist info)
 */
const getAllServices = async () => {
  const services = await prisma.service.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      specialist: {
        select: { id: true, name: true, email: true },
      },
    },
  });
  return services;
};

const getServiceBySpecialistId = async (specialistId: string) => {
  if (!specialistId) {
    throw new Error("Specialist ID is required");
  }

  // Check if the specialist exists (optional, but recommended)
  const specialist = await prisma.specialist.findUnique({
    where: { id: specialistId },
  });

  if (!specialist) {
    throw new Error("Specialist not found");
  }

  // Fetch all services for the given specialist
  const services = await prisma.service.findMany({
    where: { specialistId },
    orderBy: { createdAt: "desc" },
    include: {
      specialist: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  return services;
};

export const serviceServices = {
  createService,
  getAllServices,
  getServiceBySpecialistId
};
