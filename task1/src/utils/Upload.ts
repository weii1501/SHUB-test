import multer from 'multer';
import fs from 'fs';
import { Request } from 'express';

const limits = { fileSize: 15000000000 };

export function uploadFile(filePath: string, fileName: string) {
    
  try {
    if (!fs.existsSync(filePath)) {
      fs.mkdirSync(filePath, { recursive: true });
      console.log(`Directory created or already exists at: ${filePath}`);
    }

    const storage = multer.diskStorage({
      destination: (req: Request, file, cb) => cb(null, filePath), // function quyết định lưu vào đâu
      filename: (req: Request, file, cb) => {
        if (!file.originalname.toLowerCase().match(
          /\.(xls|xlsx|csv)$/
        )) {
          return cb(new Error('Please upload the correct file'));
        }
        const typeFile = /[^.]+$/.exec(file.originalname);
        if (typeFile) {
          fileName = `${fileName}.${typeFile[0]}`;
          cb(null, fileName); // null là không có lỗi gì
        } else {
          cb(new Error('Unable to determine file type'));
        }
      },
    });

    return multer({ storage, limits });
  } catch (error) {
    console.log('error multer: ', error);
  }
}
