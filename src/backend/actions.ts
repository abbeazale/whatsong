import { v2 as cloudinary } from 'cloudinary';


export async function uploadPic(image: string): Promise<{ url: string; type: string }> {
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