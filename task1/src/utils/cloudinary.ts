import cloudinary from 'cloudinary';
import dotenv from "dotenv";
dotenv.config(); 

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const cloudinaryUploadFile = async (fileToUploads: string): Promise<{ url: string }> => {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader.upload(
      fileToUploads,
      { resource_type: 'auto' },
      (error, result) => {
        if (error) {
          reject(error);
        } else if (result) {
          resolve({ url: result.secure_url });
        }
      }
    );
  });
};

export default cloudinaryUploadFile;