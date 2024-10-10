import { ExcelDataInterface, readExcelFile } from "../utils/XlsxHandler";
import { parse, isAfter, isBefore, isEqual } from 'date-fns';
import path from "path";


class FileServiceClass {
    async getData_v2(start: any, end: any, largestFile: any): Promise<ExcelDataInterface[]> {
        const URL = path.join(__dirname, '../../uploads', largestFile);
        const data = await readExcelFile(URL);
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
    }

}

const FileService = new FileServiceClass();

export default FileService;