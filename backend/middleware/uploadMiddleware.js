const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const path = require('path');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const isVideo = file.mimetype.includes('video');
    return {
      folder: 'shutters_by_shella',
      resource_type: isVideo ? 'video' : 'image',
      format: isVideo ? 'mp4' : 'webp', // Auto convert images to webp
      transformation: isVideo ? [] : [{ quality: 'auto:good' }]
    };
  },
});

const upload = multer({ 
  storage: storage,
  limits: { 
    fileSize: 50 * 1024 * 1024 // 50MB global max
  },
  fileFilter: (req, file, cb) => {
    // We will check specific limits in the route to give better error messages
    cb(null, true);
  }
});

module.exports = { upload, cloudinary };
