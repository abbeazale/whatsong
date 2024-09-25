# What Song

Quick Website I made for my girlfrined since she always asks what song to add with her instagram stories. 
## Features

- **Image Upload**: Submit an image 
- **Music Search Customization**:
  - Select a genre to narrow down the musical style.
  - Specify a time frame to set the mood (e.g., 80s, 90s, modern).
  - Optionally give an artist name you want it by.
- **AI-Powered Image Analysis**: Uses Google's Gemini Vision to analyze the vibe of the image.
- **Smart Song Matching**: Searches for and suggests songs that match the vibe of your image based on your preferences.
- **Social Media Integration**: Easily share your image-music combination on popular social media platforms. (coming soon)

## How It Works

1. **Upload**: Submit your image through the user-friendly interface. The image is securely uploaded to Cloudinary.
2. **Analyze**: Google's Gemini Vision API analyzes the uploaded image to determine its mood and content.
3. **Customize**: Choose your preferred genre and time frame for the music search.
4. **Match**: Based on the image analysis and your preferences, the app searches for and suggests matching songs.
5. **Preview**: Listen to the suggested songs and see how they pair with your image.
6. **Share**: Post your perfect image-music combo directly to your favorite social media platforms.

## Technology Stack

- Frontend: Next.js with TypeScript
- Backend: Node.js
- Image Upload: Cloudinary
- Image Analysis: Google's Gemini Vision API
- Hosting: Vercel

## Development

Made this quick on my own if you want to add to it youre always welcome

## Getting Started

To run this project locally:

1. Clone the repository
2. Install dependencies with `npm install`
3. Set up environment variables
4. Run the development server with `npm run dev`

## Environment Variables

Ensure you have the following environment variables set up:

- `CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name
- `CLOUDINARY_API_KEY`: Your Cloudinary API key
- `CLOUDINARY_API_SECRET`: Your Cloudinary API secret
- `GEMINI_APi`: Your Google Gemini Vision API key

