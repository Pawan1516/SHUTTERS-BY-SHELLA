const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const path = require('path');

console.log('☁️ Cloudinary Config:', {
  name: process.env.CLOUDINARY_CLOUD_NAME,
  key: process.env.CLOUDINARY_API_KEY?.substring(0, 4) + '...',
  secret: process.env.CLOUDINARY_API_SECRET ? 'SET' : 'NOT SET'
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    console.log(`📦 Processing file: ${file.originalname} (${file.mimetype})`);
    const isVideo = file.mimetype.startsWith('video');
    return {
      folder: 'shutters-by-shella',
      resource_type: isVideo ? 'video' : 'image',
      format: isVideo ? 'mp4' : 'webp', // Auto convert images to webp
      transformation: isVideo ? [] : [{ quality: 'auto:good' }],
      public_id: `${Date.now()}-${file.originalname.split('.')[0]}`
    };
  },
});

const fileFilter = (req, file, cb) => {
  const isVideo = file.mimetype.startsWith('video');
  const maxSize = isVideo ? 50 * 1024 * 1024 : 5 * 1024 * 1024; // 50MB for video, 5MB for image
  
  // Note: Multer's fileFilter doesn't have the file size yet, we check size in the limits option
  if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images and videos are allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    // This is a global limit. Since we have different limits, we handle logic in routes or just use a 50MB cap here
    fileSize: 50 * 1024 * 1024 
  }
});

module.exports = upload;
