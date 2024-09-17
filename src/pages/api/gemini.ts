import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager, UploadFileResponse } from "@google/generative-ai/server";
import { NextApiRequest, NextApiResponse } from "next";
import path from 'path';
import fs from 'fs';

const genai = new GoogleGenerativeAI(process.env.GEMINI_API || "");
const model = genai.getGenerativeModel({model: "gemini-1.5-flash"});
const filemanager = new GoogleAIFileManager(process.env.GEMINI_API || "");

export default async function handler(req: NextApiRequest, res: NextApiResponse){

    if(req.method !== 'POST'){
        return res.status(405).json({message: 'Method not allowed'});
    }

    const { image, genre, artist, description, startDecade, endDecade } = req.body;

    try{
        
        const base64Image = image.split(';base64,').pop();
        const uploadDir = path.join(process.cwd(), 'uploads');
        const filePath = path.join(uploadDir, 'image.jpg');

        await fs.promises.mkdir(uploadDir, { recursive: true });
        await fs.promises.writeFile(filePath, base64Image, 'base64');


        const uploadImage = await filemanager.uploadFile(filePath, {
        mimeType: "image/jpeg",
        displayName: "song inspo",
        });

        console.log('Image uploaded successfully', uploadImage);

        const result = await model.generateContent([
            `think of a description for this photo and then sugguest a song that matches the vibe. 
            ${description} I want it to be a ${genre} song from 
            ${startDecade} to ${endDecade} from ${artist}. Just respond in the format of:
            "Song name: [song name] artist: [artist name]". and dont include the description 
            in the reply`,
            {
                fileData: {
                fileUri: uploadImage.file.uri,
                mimeType: uploadImage.file.mimeType,
                },
            },
        ]);

        console.log(result.response.text());
        res.status(200).json({ description: result.response.text() });

    } catch(error){
        console.error('Error:', error);
        res.status(500).json({message: 'Error generating description'});
    }
}