import express, { NextFunction, Request, Response } from "express"
import { fileUploader } from "../../../helpers/fileUploder";
import { specialistController } from "./specialist.controller";
import auth from "../../middleware/auth";
import { Role } from "../../../../generated/prisma";

const router = express.Router()

router.post(
  "/create-specialist",
  auth(Role.ADMIN),
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    return specialistController.createSpecialistController(req, res, next);
  }
);



export const specialistRouter = router
