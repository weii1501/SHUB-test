import dotenv from "dotenv";
import express, { Request, Response, NextFunction } from "express";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import apiRouter from "./routes";
import "reflect-metadata";

const app = express();
dotenv.config();

// init middleware
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// init routes
app.use("/v1/api", apiRouter);

// handling routes
app.use((req: Request, res: Response, next: NextFunction) => {
  const error = new Error("Not found");
  error['status'] = 404;
  next(error);
});

// handling errors
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = error.status || 500;
  return res.status(statusCode).json({
    status: "error",
    code: statusCode, 
    message: error.message || 'Internal Server Error',
  });
});

export default app;
