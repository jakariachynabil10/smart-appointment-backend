import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { availabilityService } from "./availability.service";
import httpStatus from "http-status";

/**
 * Create new availability
 */
const createAvailability = catchAsync(async (req, res) => {
  const result = await availabilityService.createAvailability(req);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Availability created successfully",
    data: result,
  });
});

/**
 * Get all availability by specialist ID
 */
const getAvailabilityBySpecialist = catchAsync(async (req, res) => {
  const { specialistId } = req.params;
  const result = await availabilityService.getAvailabilityBySpecialist(specialistId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Availability fetched successfully",
    data: result,
  });
});

export const availabilityController = {
  createAvailability,
  getAvailabilityBySpecialist,
};
