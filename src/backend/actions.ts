import { v2 as cloudinary } from 'cloudinary';


export async function uploadPic(image: string): Promise<{ url: string; type: string }> {

  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.error('Cloudinary environment variables are not set');
    throw new Error('Cloudinary configuration is incomplete');
  } else if (process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_API_KEY || process.env.CLOUDINARY_API_SECRET) {
    console.log('Cloudinary environment variables are set');
  }

  cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
  });

  try {
    console.log('Attempting to upload image to Cloudinary...');
    const result = await cloudinary.uploader.upload(image, {
      folder: 'uploads',
    });
    console.log('Image uploaded successfully:', result.secure_url);
    return { url: result.secure_url, type: result.format };
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    throw error;
  }
}