import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextApiRequest, NextApiResponse } from "next";
import { uploadPic } from "../../backend/actions";
import fetch from 'node-fetch';

const genai = new GoogleGenerativeAI(process.env.GEMINI_API || "");
const model = genai.getGenerativeModel({ model: "gemini-1.5-pro" });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { image, genre, artist, description, startDecade, endDecade } = req.body;

    try {
        const { url: imageuri, type: imageType } = await uploadPic(image);

        const imageResponse = await fetch(imageuri);
        const imageBuffer = await imageResponse.arrayBuffer();

        const result = await model.generateContent([
            `think of a description for this photo and then sugguest a song that matches the description. 
            ${description} I want it to be a ${genre} song from 
            ${startDecade} to ${endDecade} from ${artist}. Just respond in the format of:
            "Song name: [song name] Artist: [artist name]". and dont include the description 
            in the reply`,
            {
                inlineData: {
                    mimeType: `image/${imageType}`,
                    data: Buffer.from(imageBuffer).toString('base64')
                },
            },
        ]);

        console.log(result.response.text());
        res.status(200).json({ description: result.response.text() });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error generating description' });
    }
}