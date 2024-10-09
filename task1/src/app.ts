import dotenv from "dotenv";
import express, { Request, Response, NextFunction } from "express";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import apiRouter from "./routes";
import "reflect-metadata";
import { myDataSource } from "./app-data-source";
import { checkOverload, countConnect } from "./helper/chech.connect";
import bodyParser from "body-parser";

const app = express();
dotenv.config();

// interface
interface HttpError extends Error {
  status?: number;
}

// init middleware
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// init db
// import "./db/data-source";
myDataSource
  .initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
    countConnect();
    checkOverload();
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });

// init routes
app.use("/v1/api", apiRouter);

// handling routes
app.use((req: Request, res: Response, next: NextFunction) => {
  const error: HttpError = new Error("Not found");
  error.status = 404;
  next(error);
});

// handling errors
app.use((error: HttpError, req: Request, res: Response, next: NextFunction) => {
  const statusCode = error.status || 500;
  return res.status(statusCode).json({
    status: "error",
    code: statusCode,
    message: error.message,
  });
});

console.log("App is running on port 3000");

export default app;
