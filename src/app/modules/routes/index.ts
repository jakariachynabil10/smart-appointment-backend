import express from "express"
import { UserRoutes } from "../User/user.route"
import { authRouter } from "../Auth/auth.route"
import { specialistRouter } from "../Specialist/specialist.route"
import { serviceRoutes } from "../Service/service.route"


const router = express.Router()

const moduleRoutes = [
    {
        path : "/user",
        route : UserRoutes
    },
    {
        path : "/auth",
        route : authRouter
    },
    {
        path : "/specialist",
        route : specialistRouter
    },
    {
        path : "/service",
        route : serviceRoutes
    },
]

moduleRoutes.forEach(route => router.use(route.path, route.route))
export default router