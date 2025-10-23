import prisma from "../../../shared/prisma";
import { Request } from "express";

/**
 * Create a new service
 */
const createService = async (req: Request) => {
  const { name, description, duration, price } = req.body;

  if (!name || !duration) {
    throw new Error("Name and duration are required");
  }

  const newService = await prisma.service.create({
    data: {
      name,
      description,
      duration: parseInt(duration),
      price: price ? parseFloat(price) : null,
    },
  });

  return newService;
};

/**
 * Get all services
 */
const getAllServices = async () => {
  const services = await prisma.service.findMany({
    orderBy: { createdAt: "desc" },
  });
  return services;
};

export const serviceServices = {
  createService,
  getAllServices,
};
