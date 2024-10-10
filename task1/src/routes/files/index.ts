import express, { NextFunction, Request, Response } from "express";
import MessageHandle from "../../utils/MessageHandle";
import { uploadFile } from "../../utils/Upload";
import { query } from "express-validator";
import { validationErrorHandler } from "../../middlewares/validationErrorHandler";
import FileController from "../../controllers/file.controller";
import { asyncHandler } from "../../helper/asyncHandler";

const dateFormaterRegex = /^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}$/;

const filesRouter = express.Router();

filesRouter.route("/get-data").get(
    query("start")
        .isString()
        .optional()
        .matches(dateFormaterRegex)
        .withMessage('Thời gian phải có định dạng dd/MM/yyyy HH:mm:ss'),
    query("end")
        .isString()
        .optional()
        .matches(dateFormaterRegex)
        .withMessage('Thời gian phải có định dạng dd/MM/yyyy HH:mm:ss'),
    validationErrorHandler,
    asyncHandler(FileController.getData_v2)
);


filesRouter.route("/upload").post(FileController.uploadFile)

export default filesRouter;