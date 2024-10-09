import express, { Request, Response } from "express";
import MessageHandle from "../../utils/MessageHandle";
import { uploadFile } from "../../utils/Upload";
import { query } from "express-validator";
import { validationErrorHandler } from "../../middlewares/validationErrorHandler";
import FileController from "../../controllers/file.controller";

const dateFormaterRegex = /^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}$/;

const filesRouter = express.Router();

filesRouter.route("/").post(async function (req: Request, res: Response) {
    const filePath = `${__dirname}/../../../storage/files`;
    const fileName = `${Date.now()}`;
    const upload = uploadFile(filePath, fileName);
    upload.single('file')(req, res, (error) => {
        if (!error) {
            MessageHandle(
                async function (client) {
                    req.body.filePath = filePath;
                    req.body.fileName = fileName;
                    const results = await FileController.createFile(req.body, req['file']);
                    return results;
                },
                req,
                res,
            );
        } else {
            console.error('error: ', error.message);
            return res.status(400).json({ message: error.message });
        }
    });
});

filesRouter.route("/").get(
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
    async function (req: Request, res: Response) {
        MessageHandle(
            async function (client) {
                const start = req.query?.start?.toString();
                const end = req.query?.end?.toString();
                const result = await FileController.getData(start, end);
                return result;
            },
            req,
            res
        );
    });

filesRouter.route("/get-all").get(async function (req: Request, res: Response) {
    MessageHandle(
        async function (client) {
            const result = await FileController.getAllFiles();
            return result;
        },
        req,
        res
    );
});

export default filesRouter;