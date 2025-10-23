import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { specialistService } from "./specialist.service";

const createSpecialistController = catchAsync(async (req: Request, res: Response) => {
  const result = await specialistService.createSpecialist(req);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Specialist created successfully",
    data: result,
  });
});
const getAllSpecialist = catchAsync(async (req: Request, res: Response) => {
  const result = await specialistService.getAllSpecialist();

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Specialists fetched successfully",
    data: result,
  });
});


export const specialistController = {
    createSpecialistController,
    getAllSpecialist
}