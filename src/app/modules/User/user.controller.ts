import { Request, Response } from "express";

import { userService } from "./user.service";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { IAuthUser } from "./user.interface";

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



const getMyProfile = catchAsync(async (req: Request & { user?: IAuthUser }, res: Response) => {

    const user = req.user;

    const result = await userService.getMyProfile(user as IAuthUser);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "My profile data fetched!",
        data: result
    })
});
const deleteUserById = catchAsync(async (req: Request, res: Response) => {

  const {id} = req.params

    const result = await userService.deleteUserById(id);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "User Deleted Successfully",
        data: result
    })
});





export const userController = {
  createAdminController,
  createUserController,
  getAllFromDB,
  getMyProfile,
  deleteUserById
};
