import express from "express"
import { UserRoutes } from "../User/user.route"
import { authRouter } from "../Auth/auth.route"


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
]

moduleRoutes.forEach(route => router.use(route.path, route.route))
export default router