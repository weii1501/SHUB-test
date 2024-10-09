import { myDataSource } from "../app-data-source";
import { readExcelFile } from "../utils/XlsxHandler";
import { parse, isAfter, isBefore, isEqual } from 'date-fns';
import { File as FileType } from "../utils/interface";
import { File } from "../entity/file.entity";
import { Repository } from "typeorm";
import { BadRequestError, CustomError } from "../core/error.response";
import cloudinaryUploadFile from "../utils/cloudinary";
import fs from 'fs';
import { url } from "inspector";

class FileServiceClass {
    repository: Repository<File>;

    constructor() {
        this.repository = myDataSource.getRepository(File);
    }

    async getData(start: string | undefined, end: string | undefined) {
        try {
            const lastestFile = await this.repository.find({
                order: {
                    createdAt: 'DESC',
                },
                take: 1,
            });
            const { url } = lastestFile[0];
            const data = await readExcelFile(url);

            if (!start && !end) {
                return data;
            }
            const result = data.filter((item) => {
                const formatString = 'dd/MM/yyyy HH:mm:ss';
                const startDate = start ? parse(start, formatString, new Date()) : null;
                const endDate = end ? parse(end, formatString, new Date()) : null;
                const itemDate = parse(item.createAt, formatString, new Date());

                if (!startDate && endDate) {
                    return isBefore(itemDate, endDate) || isEqual(itemDate, endDate);
                } else if (startDate && !endDate) {
                    return isAfter(itemDate, startDate) || isEqual(itemDate, startDate);
                } else if (startDate && endDate) {
                    return (isAfter(itemDate, startDate) || isEqual(itemDate, startDate)) &&
                        (isBefore(itemDate, endDate) || isEqual(itemDate, endDate));
                }

            })
            return result;
        } catch (error) {
            console.log(error);
            if (error instanceof BadRequestError) {
                throw new BadRequestError(error.message);
            } else if (error instanceof CustomError) {
                throw new CustomError(error.message, error.status);
            } else {
                throw new Error();
            }
        }
    }

    async createFile(body: any, file: FileType) {
        try {
            if (!file) {
                throw new BadRequestError("File not found");
            }

            const { path } = file;
            const uploader = (path) => cloudinaryUploadFile(path);
            const { fileName } = body;
            const newPath = await uploader(path);
            console.log('newPath: ', newPath);
            fs.unlinkSync(path);
            const fileTypeMatch = /[^.]+$/.exec(file.originalname);
            if (!fileTypeMatch) {
                throw new BadRequestError("Invalid file name");
            }
            const fileType = fileTypeMatch[0];

            const fileIns = await this.repository.create({
                filePath: file.path,
                fileName: `${fileName}.${fileType}`,
                url: newPath.url,
            });

            const result = await this.repository.save(fileIns);
            return result;
        } catch (error) {
            console.log(error);
            if (error instanceof BadRequestError) {
                throw new BadRequestError(error.message);
            } else if (error instanceof CustomError) {
                throw new CustomError(error.message, error.status);
            } else {
                throw new Error();
            }
        }
    }

    async getAllFiles() {
        try {
            const result = await this.repository.find();
            return result;
        } catch (error) {
            console.log(error);
            if (error instanceof BadRequestError) {
                throw new BadRequestError(error.message);
            } else if (error instanceof CustomError) {
                throw new CustomError(error.message, error.status);
            } else {
                throw new Error();
            }
        }
    }

}

const FileService = new FileServiceClass();

export default FileService;