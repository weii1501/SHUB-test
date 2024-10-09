import express from "express";
import filesRouter from "./files";

const apiRouter = express.Router();

apiRouter.use("/files", filesRouter);

export default apiRouter;