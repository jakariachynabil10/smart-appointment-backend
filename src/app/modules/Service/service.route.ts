    import express from "express";
    import { serviceController } from "./service.controller";
    import auth from "../../middleware/auth";
    import { Role } from "../../../../generated/prisma";

    const router = express.Router();

    router.post("/create-service",auth(Role.ADMIN, Role.SUPERADMIN), serviceController.createService);
    router.get("/", serviceController.getAllServices);
    router.get("/:specialistId", auth(), serviceController.getServiceBySpecialistId);

    export const serviceRoutes = router;
