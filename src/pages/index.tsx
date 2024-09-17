import { useState } from "react";
import Image from "next/image";

// Define the Prompt interface
interface Prompt {
  image: File | null | string;
  genre: string;
  artist: string;
  startDecade: string;
  endDecade: string;
  description: string;
}
//handle image type

// Define the genres array
const genres = ["Pop", "Rock", "Hip Hop", "Electronic", "Classical","Latin", "Jazz", "Country", "R&B"];

// Define the decades array
const decades = ["1920", "1930", "1940", "1950", "1960", "1970", "1980", "1990", "2000", "2010", "2020"];

function toBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}


export default function Home() {
  const [prompt, setPrompt] = useState<Prompt>({
    image: null,
    genre: "",
    artist: "",
    startDecade: "",
    endDecade: "",
    description: "",
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [generatedDescription, setGeneratedDescription] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPrompt({ ...prompt, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPrompt({ ...prompt, [name]: value });
  };

  const generateSongs = async () => {

    if (prompt.image instanceof File) {
      prompt.image = await toBase64(prompt.image);
    }
   

    if(!prompt.artist){
      prompt.artist = "any artist"
    }




    if (!prompt.image || !prompt.genre || !prompt.artist || !prompt.startDecade || !prompt.endDecade) {
      setError("Please fill out all options");
      return;
    }

    setError(null);
    
    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
    
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(prompt),
      });
  
      if (!response.ok) {
        throw new Error('Failed to generate description');
      }
  
      const data = await response.json()
      console.log(data)
      setGeneratedDescription(data.description)
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to generate description. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-6xl font-bold mb-8 text-center">The Perfect Song</h1>
      
      <form className="w-full max-w-md space-y-4 flex flex-col items-center">
        {error && (
          <div className="w-full text-red-500 text-center font-bold mb-4">
            {error}
          </div>
        )}

        {imagePreview && (
          <div className="mb-4">
            <Image src={imagePreview} alt="Uploaded image" width={400} height={400} className="rounded" />
          </div>
        )}
        
        <div className="w-full">
          <label htmlFor="image" className="block mb-2 text-center">Upload an image</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full p-2 bg-gray-800 rounded"
          />
        </div>
        
        <div className="w-full">
          <label htmlFor="genre" className="block mb-2 text-center">Genre</label>
          <select
            id="genre"
            name="genre"
            value={prompt.genre}
            onChange={handleInputChange}
            className="w-full p-2 bg-gray-800 rounded text-white"
          >
            <option value="">Select a genre</option>
            {genres.map((genre) => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </select>
        </div>
        
        <div className="w-full">
          <label htmlFor="artist" className="block mb-2 text-center">Artist</label>
          <input
            type="text"
            id="artist"
            name="artist"
            value={prompt.artist}
            onChange={handleInputChange}
            className="w-full p-2 bg-gray-800 rounded"
          />
        </div>
        
        <div className="w-full flex space-x-4">
          <div className="w-1/2">
            <label htmlFor="startDecade" className="block mb-2 text-center">Start Decade</label>
            <select
              id="startDecade"
              name="startDecade"
              value={prompt.startDecade}
              onChange={handleInputChange}
              className="w-full p-2 bg-gray-800 rounded text-white"
            >
              <option value="">Select</option>
              {decades.map((decade) => (
                <option key={decade} value={decade}>{decade}s</option>
              ))}
            </select>
          </div>
          <div className="w-1/2">
            <label htmlFor="endDecade" className="block mb-2 text-center">End Decade</label>
            <select
              id="endDecade"
              name="endDecade"
              value={prompt.endDecade}
              onChange={handleInputChange}
              className="w-full p-2 bg-gray-800 rounded text-white"
            >
              <option value="">Select</option>
              {decades.map((decade) => (
                <option key={decade} value={decade}>{decade}s</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="w-full">
          <label htmlFor="description" className="block mb-2 text-center">Description</label>
          <textarea
            id="description"
            name="description"
            value={prompt.description}
            onChange={handleInputChange}
            className="w-full p-2 bg-gray-800 rounded resize-none"
            rows={3}
          />
        </div>
        
        <button
          type="button"
          onClick={generateSongs}
          className="w-full bg-white text-black font-bold py-2 px-4 rounded hover:bg-gray-200"
        >
          Submit
        </button>
      </form>

      {generatedDescription && (
        <div className="mt-8 w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4">Generated Description:</h2>
          <p className="bg-gray-800 p-4 rounded whitespace-pre-wrap">{generatedDescription}</p>
        </div>
      )}
    </div>
  );
}
