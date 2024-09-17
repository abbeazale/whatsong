import { NextApiRequest, NextApiResponse } from 'next';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_KEY || ''
  });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { image, genre, artist, startDecade, endDecade } = req.body;
  
    console.log(process.env.ANTHROPIC_KEY)
  
  try {
    const completion = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 300,
      messages: [
        {
          "role": "user",
          "content": [
            {
              "type": "image",
              "source": {
                "type": "base64",
                "media_type": "image/jpeg" || "image/png",
                "data": image,
              },
            },
            {
              "type": "text",
              "text": `Make a description for this photo. I want it to be a ${genre} song from ${startDecade} to ${endDecade} in the style of ${artist}.
                now generate 5 songs that fit this description`
            }
          ],
        }
      ],
    });

    console.log(completion.content);
    res.status(200).json({ description: completion.content });
   
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error generating description' });
  }
}