import FileService from "../service/file.service";
import { NextFunction, Request, Response } from "express";
import Busboy from 'busboy';
import fs from 'fs';
import path from 'path';
import { validateExcelFile } from "../utils/validateExcelFile";
import { Created, SuccessResponse } from "../core/success.response";
import { BadRequestError, ServerError } from "../core/error.response";


class FileControllerClass {

    async uploadFile(req: Request, res: Response, next: NextFunction): Promise<void> {
        const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB
        const busboy = Busboy({
            headers: req.headers,
            limits: {
                fileSize: MAX_FILE_SIZE, // 50 MB limit
            },
        });

        busboy.on('file', (fieldname, file, info) => {
            const { filename, encoding, mimeType } = info;
            console.log(`Receiving file: ${filename}`);

            // Validate the file type
            const allowedMimeTypes = [
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // XLSX
                'application/vnd.ms-excel', // XLS
            ];
            const allowedExtensions = ['.xlsx', '.xls'];
            const fileExtension = path.extname(filename).toLowerCase();

            if (!allowedMimeTypes.includes(mimeType) || !allowedExtensions.includes(fileExtension)) {
                console.error('Phẩn mở rộng hoặc loại tệp không được phép.');
                next(new BadRequestError("Phẩn mở rộng hoặc loại tệp không được phép"));
            }

            // Variables for validation
            const MAX_HEADER_SIZE = 4; // Adjust as needed
            let headerBuffer = Buffer.alloc(0);
            let validationDone = false;


            // Prepare to save the file
            const safeFilename = `${Date.now()}${fileExtension}`;
            const saveTo = path.join(__dirname, '../../uploads', safeFilename);
            fs.mkdirSync(path.dirname(saveTo), { recursive: true });

            const writeStream = fs.createWriteStream(saveTo);
            let writeStreamOpen = true;

            // Handle write stream errors
            writeStream.on('error', (err) => {
                writeStreamOpen = false;
                file.destroy();
                next(new ServerError('Lỗi xử lý tệp'));
            });

            file.on('data', (chunk: Buffer) => {
                if (!validationDone) {
                    const bytesNeeded = MAX_HEADER_SIZE - headerBuffer.length;
                    headerBuffer = Buffer.concat([headerBuffer, chunk.slice(0, bytesNeeded)]);
                    // After collecting enough bytes, perform validation
                    if (headerBuffer.length >= MAX_HEADER_SIZE) {
                        validationDone = true;
                        const fileValid = validateExcelFile(headerBuffer);

                        if (!fileValid) {
                            console.error('Loại tệp không hợp lệ. Vui lòng tải lên tệp Excel.');
                            // Clean up streams and delete file
                            if (writeStreamOpen) {
                                writeStream.destroy();
                                writeStreamOpen = false;
                            }
                            file.destroy();
                            fs.unlink(saveTo, (err) => {
                                if (err) console.error('Error deleting incomplete file:', err);
                            });
                            next(new BadRequestError("Loại tệp không hợp lệ. Vui lòng tải lên tệp Excel."));
                            // return;
                        }
                    }

                }

                // Continue writing to file after validation
                if (validationDone && writeStreamOpen) {
                    writeStream.write(chunk);
                }
            });

            file.on('end', () => {
                if (validationDone && writeStreamOpen) {
                    writeStream.end(() => {
                        console.log('Tải lên tệp thành công');
                        new Created({
                            message: 'Tải lên tệp thành công',
                            metadata: {
                                filename: safeFilename,
                            }
                        }).send(res);
                    });
                }
            });

            file.on('error', (err) => {
                console.error('File stream error:', err);
                if (writeStreamOpen) {
                    writeStream.destroy();
                    writeStreamOpen = false;
                }
                next(new ServerError('Lỗi xử lý tệp'));
            });
        });

        busboy.on('error', (err) => {
            console.error('Busboy error:', err);
            next(new ServerError('Tải lên tệp không thành công'));
        });

        req.pipe(busboy);
    }

    async getData_v2(req: Request, res: Response): Promise<void> {
        const { start, end } = req.query;
        try {
            // Read all files in the directory
            const files = fs.readdirSync(path.join(__dirname, '../../uploads'));

            // Extract numeric part from filenames and find the largest
            let largestNumber = -Infinity;
            let largestFile: string | undefined;

            files.forEach(file => {
                // Extract numeric part from the filename using regex
                const match = file.match(/(\d+)\.xlsx$/);
                if (match) {
                    const number = parseInt(match[1], 10);
                    if (number > largestNumber) {
                        largestNumber = number;
                        largestFile = file;
                    }
                }
            });

            const result = await FileService.getData_v2(start, end, largestFile);
            new SuccessResponse({
                message: 'Data retrieved successfully',
                metadata: result,
            }).send(res);

        } catch (error) {
            console.error('Error reading directory:', error);
            return undefined;
        }
    }
}

const FileController = new FileControllerClass();

export default FileController;