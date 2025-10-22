import express, { Application, Request, Response } from "express";
import cors from "cors";
import globalErrorHandler from "./app/middleware/globalErrorHandling";
import router from "./app/modules/routes";

const app: Application = express();
app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send({
    Message: "Backend is working perfectly",
  });
});

app.use("/api", router);

app.use(globalErrorHandler);

export default app;
