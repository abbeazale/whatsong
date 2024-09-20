import { v2 as cloudinary } from 'cloudinary';



export async function uploadPic(image: string): Promise<{ url: string; type: string }>{
  try {
    const result = await cloudinary.uploader.upload(image, {
      folder: 'uploads', // Optional: specify a folder in your Cloudinary account
    });
    return { url: result.secure_url, type: result.format };
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}