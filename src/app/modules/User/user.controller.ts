import { Request, Response } from "express";

import { userService } from "./user.service";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";

/**
 * Create Admin Controller
 */
const createAdminController = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.createAdmin(req);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Admin created successfully",
    data: result,
  });
});

/**
 * Create Regular User Controller
 */
const createUserController = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.createUser(req);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "User created successfully",
    data: result,
  });
});

/**
 * Create Specialist Controller
 */



const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.getAllFromDB();

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Users fetched successfully!",
    data: result,
  });
});

export const userController = {
  createAdminController,
  createUserController,
  getAllFromDB
};
