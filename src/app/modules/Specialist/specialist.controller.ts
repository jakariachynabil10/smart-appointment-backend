import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { specialistService } from "./specialist.service";

/**
 * Create Specialist Controller
 */
const createSpecialistController = catchAsync(async (req: Request, res: Response) => {
  const result = await specialistService.createSpecialist(req);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Specialist created successfully",
    data: result,
  });
});

/**
 * Get All Specialists
 */
const getAllSpecialist = catchAsync(async (req: Request, res: Response) => {
  const result = await specialistService.getAllSpecialist();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Specialists fetched successfully",
    data: result,
  });
});

/**
 * Get Appointments by Specialist ID
 */
const getAppointmentBySpecialistID = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params; // specialist ID from route
  const result = await specialistService.getAppointmentBySpecialistID(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Appointments fetched successfully for the specialist",
    data: result,
  });
});

export const specialistController = {
  createSpecialistController,
  getAllSpecialist,
  getAppointmentBySpecialistID,
};
