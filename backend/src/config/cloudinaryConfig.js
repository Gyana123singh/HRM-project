const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'demo',
  api_key: process.env.CLOUDINARY_API_KEY || '123456789',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'secret'
});

const uploadToCloudinary = (fileBuffer, originalName = 'document') => {
  return new Promise((resolve, reject) => {
    // If Cloudinary keys are standard demo/unconfigured, return simulated Cloudinary URL
    if (!process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME === 'demo') {
      const simulatedUrl = `https://res.cloudinary.com/demo/image/upload/v1700000000/hrm_docs/${Date.now()}_${originalName.replace(/\s+/g, '_')}`;
      return resolve({
        secure_url: simulatedUrl,
        public_id: `hrm_docs/${Date.now()}_${originalName}`,
        original_filename: originalName
      });
    }

    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'hrm_employee_documents',
        resource_type: 'auto'
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    stream.end(fileBuffer);
  });
};

module.exports = {
  cloudinary,
  uploadToCloudinary
};
