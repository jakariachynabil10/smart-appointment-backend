import express, { NextFunction, Request, Response } from "express";
import { userController } from "./user.controller";
import { fileUploader } from "../../../helpers/fileUploder";
import auth from "../../middleware/auth";
import { Role } from "../../../../generated/prisma";

const router = express.Router();

router.post(
  "/create-admin",
  // auth(Role.ADMIN),
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




router.get("/", userController.getAllFromDB)

export const UserRoutes = router;
