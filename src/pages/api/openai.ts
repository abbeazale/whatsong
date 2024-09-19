import OpenAI from "openai";
import { NextApiRequest, NextApiResponse } from "next";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_KEY
});



export default async function handler(req: NextApiRequest, res: NextApiResponse){
    if(req.method !== 'POST'){
        return res.status(405).json({message: 'Method not allowed'});
    }

    //add image to the requst for openAI requests 
    const {  genre, artist, startDecade, endDecade } = req.body;
    
    try{
        const message = await openai.chat.completions.create({
            model: "davinci-002",
            messages: [
                    {
                        role: "user",
                        content: [
                            {
                                type: "text", 
                                text: `Make a description for this photo. I want it to be a ${genre} song from 
                                ${startDecade} to ${endDecade} in the style of ${artist}.`
                            },{
                                type: 'image_url',
                                image_url: {
                                    "url": ""
                                }
                            }
                        ]
                    }
                ]
        });

        console.log(message.choices[0]);
        res.status(200).json({description: message.choices[0]});
    } catch(error){
        console.error('Error:', error);
        res.status(500).json({message: 'Error generating description'});
    }

}