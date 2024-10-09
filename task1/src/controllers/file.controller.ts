import FileService from "../service/file.service";
import { File } from "../utils/interface";


class FileController {

    static async getData (start: string | undefined, end: string | undefined) {
        const result = await FileService.getData(start, end);
        return result;
    }

    static async createFile (body: any, file: File) {
        const result = await FileService.createFile(body, file);
        return result;
    }

    static async getAllFiles () {
        const result = await FileService.getAllFiles();
        return result;
    }
}

export default FileController;