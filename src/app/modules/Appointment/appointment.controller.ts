import { Request, Response } from "express";
import { appointmentService } from "./appointment.service";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";

const createAppointment = catchAsync(async (req: Request, res: Response) => {
  const result = await appointmentService.createAppointment(req);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Appointment created successfully",
    data: result,
  });
});

const getUserAppointments = catchAsync(async (req: Request, res: Response) => {
  const result = await appointmentService.getUserAppointments(req.params.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User appointments fetched successfully",
    data: result,
  });
});

const updateAppointmentStatus = catchAsync(async (req: Request, res: Response) => {
  const result = await appointmentService.updateAppointmentStatus(req);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Appointment status updated successfully",
    data: result,
  });
});

const getAllAppointment = catchAsync(async (req: Request, res: Response) => {
  const result = await appointmentService.getAllAppointment();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "All appointments fetched successfully",
    data: result,
  });
});

export const appointmentController = {
  createAppointment,
  getUserAppointments,
  updateAppointmentStatus,
  getAllAppointment,
};
