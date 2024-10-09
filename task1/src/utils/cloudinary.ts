import cloudinary from 'cloudinary';

cloudinary.v2.config({
  cloud_name: 'dln7sory6',
  api_key: '512186482526577',
  api_secret: 'AXDRhRBMdfjb5BxevMVg_QfWlqw',
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