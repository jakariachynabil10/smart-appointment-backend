import express, { NextFunction, Request, Response } from "express";
import { userController } from "./user.controller";
import { fileUploader } from "../../../helpers/fileUploder";
import auth from "../../middleware/auth";
import { Role } from "../../../../generated/prisma";

const router = express.Router();

router.post(
  "/create-admin",
  auth(Role.SUPERADMIN),
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    return userController.createAdminController(req, res, next);
  }
);
router.post(
  "/create-user",
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    return userController.createUserController(req, res, next);
  }
);

router.get("/me", auth(Role.SUPERADMIN, Role.ADMIN, Role.SPECIALIST, Role.USER), userController.getMyProfile);

router.get("/", userController.getAllFromDB);
router.delete("/:id", auth(Role.ADMIN, Role.SUPERADMIN), userController.deleteUserById)

export const UserRoutes = router;
