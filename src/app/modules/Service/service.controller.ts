import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { serviceServices } from "./service.service";


const createService = catchAsync(async (req: Request, res: Response) => {
  const result = await serviceServices.createService(req);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Service created successfully",
    data: result,
  });
});

const getAllServices = catchAsync(async (req: Request, res: Response) => {
  const result = await serviceServices.getAllServices();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "All services retrieved successfully",
    data: result,
  });
});
const getServiceBySpecialistId = catchAsync(async (req: Request, res: Response) => {
  const {specialistId} = req.params
  console.log(specialistId)
  const result = await serviceServices.getServiceBySpecialistId(specialistId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Specialsit services retrieved successfully",
    data: result,
  });
});

export const serviceController = {
  createService,
  getAllServices,
  getServiceBySpecialistId
};
