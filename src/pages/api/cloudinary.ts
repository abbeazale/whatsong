import { v2 as cloudinary } from 'cloudinary';

if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.error('Cloudinary environment variables are not set');
  throw new Error('Cloudinary configuration is incomplete');
} else if (process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_API_KEY || process.env.CLOUDINARY_API_SECRET) {
  console.log('Cloudinary environment variables are set');
}

console.log("CLOUDINARY_CLOUD_NAME: ", process.env.CLOUDINARY_CLOUD_NAME);

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

export default cloudinary;