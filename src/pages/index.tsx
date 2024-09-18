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
const decades = [ "1960", "1970", "1980", "1990", "2000", "2010", "2020"];

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
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-5xl font-extrabold mb-10 text-center text-white tracking-tight">
        The Perfect Song
      </h1>
  
      <form className="w-full max-w-lg space-y-6 flex flex-col items-center">
        {error && (
          <div className="w-full text-red-400 bg-red-900 p-3 rounded text-center font-semibold mb-6">
            {error}
          </div>
        )}
  
        {imagePreview && (
          <div className="mb-6 rounded-lg overflow-hidden shadow-lg">
            <Image
              src={imagePreview}
              alt="Uploaded image"
              width={400}
              height={400}
              className="rounded"
            />
          </div>
        )}
  
        <div className="w-full">
          <label
            htmlFor="image"
            className="block mb-2 text-med font-medium text-center"
          >
            Upload an Image
          </label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full p-3 bg-gray-800 rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
        </div>
  
        <div className="w-full">
          <label
            htmlFor="genre"
            className="block mb-2 text-med font-medium text-center"
          >
            Genre
          </label>
          <select
            id="genre"
            name="genre"
            value={prompt.genre}
            onChange={handleInputChange}
            className="w-full p-3 bg-gray-800 rounded border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            <option value="">Select a genre</option>
            {genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </div>
  
        <div className="w-full">
          <label
            htmlFor="artist"
            className="block mb-2 text-med font-medium text-center"
          >
            Artist
          </label>
          <input
            type="text"
            id="artist"
            name="artist"
            value={prompt.artist}
            onChange={handleInputChange}
            className="w-full p-3 bg-gray-800 rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
        </div>
  
        <div className="w-full flex space-x-4">
          <div className="w-1/2">
            <label
              htmlFor="startDecade"
              className="block mb-2 text-med font-medium text-center"
            >
              Start Decade
            </label>
            <select
              id="startDecade"
              name="startDecade"
              value={prompt.startDecade}
              onChange={handleInputChange}
              className="w-full p-3 bg-gray-800 rounded border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              <option value="">Select</option>
              {decades.map((decade) => (
                <option key={decade} value={decade}>
                  {decade}s
                </option>
              ))}
            </select>
          </div>
  
          <div className="w-1/2">
            <label
              htmlFor="endDecade"
              className="block mb-2 text-med font-medium text-center"
            >
              End Decade
            </label>
            <select
              id="endDecade"
              name="endDecade"
              value={prompt.endDecade}
              onChange={handleInputChange}
              className="w-full p-3 bg-gray-800 rounded border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              <option value="">Select</option>
              {decades.map((decade) => (
                <option key={decade} value={decade}>
                  {decade}s
                </option>
              ))}
            </select>
          </div>
        </div>
  
        <div className="w-full">
          <label
            htmlFor="description"
            className="block mb-2 text-med font-medium text-center"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={prompt.description}
            onChange={handleInputChange}
            className="w-full p-3 bg-gray-800 rounded border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-gray-500 resize-none"
            rows={3}
          />
        </div>
  
        <button
          type="button"
          onClick={generateSongs}
          className="w-full bg-gray-50 text-black font-semibold py-3 px-6 rounded-lg hover:bg-gray-200 transition-all ease-in-out"
        >
          Submit
        </button>
      </form>
  
      {generatedDescription && (
        <div className="mt-10 w-full max-w-lg">
          <h2 className="text-2xl font-bold mb-4 text-center">Song Suggestion:</h2>
          <p className="bg-gray-800 p-4 rounded-lg text-white whitespace-pre-wrap shadow-md">
            {generatedDescription}
          </p>
        </div>
      )}
    </div>
  );
}
