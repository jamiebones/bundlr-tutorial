import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })
import React, { useState } from "react";

import ImageViewer from '@/components/ImageViewer';


const allowedFiles = (file) => {
  const fileTypes = ["image/png", "image/jpeg", "image/jpg", "image/gif"];
  return fileTypes.includes(file)
}


export default function Home() {
  const [imageSource, setImageSource] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null)
  const [caption, setCaption] = useState("");
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = React.useRef();

  const handleImageUpload = (event) => {

    if (event.target.files && event.target.files[0] && allowedFiles(event.target.files[0].type)) {
      setSelectedFile(event.target.files[0])
      const reader = new FileReader();
      reader.onload = function (e) {
        setImageSource(e.target.result);
      };
      reader.readAsDataURL(event.target.files[0]);
    } else {
      setImageSource(null);
    }
  };


  const uploadFileToArweave = async (event) => {
    event.preventDefault();
    try {
      if (selectedFile && caption && description) {
        setLoading(true);
        const formData = new FormData();
        //build the tags
        const applicationName = {
          name: "application-name",
          value: "image-album",
        };
        const applicationType = { name: "Content-Type", value: selectedFile.type }
        const imageCaption = { name: "caption", value: caption };
        const imageDescription = { name: "description", value: description }

        const metadata = [
          applicationName,
          imageCaption,
          imageDescription,
          applicationType
        ]

        formData.append("file", selectedFile);
        formData.append("metadata", JSON.stringify(metadata));
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
       console.log ("respone from the method: ",response.data)
      }
    } catch (error) {
      setError(error.message);
      console.log("error ", error);
    } finally {
      setLoading(false);
      setSelectedFile(null);
      setImageSource(null);
      setCaption("");
      setDescription("")
      fileInputRef.current.value = null;
    
    }
  };

  return (
    <React.Fragment>
    <div className="flex justify-center items-center">
      {error && <p>There was an error: {error}</p>}
      <div className="bg-white m-2 p-8 rounded shadow-md w-1/3">
        <h2 className="text-2xl mb-4">Upload Image</h2>
        <div className='flex-col'>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload an Image</label>
            <input
              type="file"
              className="hidden"
              id="imageInput"
              onChange={handleImageUpload}
              ref={fileInputRef}
              accept=".png, .jpg, .jpeg"
            />
          </div>

          {/* Div to display selected image */}
          <div className="mt-2">
            {imageSource ? (
              <img className="mt-2 rounded-lg" src={imageSource} alt="Selected" />
            ) : (
              <p className="text-gray-400">No image selected</p>
            )}
          </div>

          <button
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            onClick={() => document.getElementById('imageInput').click()}
          >
            Select Image
          </button>

        </div>
      </div>

      {selectedFile &&
        <div className='bg-white m-2 p-8 w-2/3'>
            <div className="bg-white p-8 m-4 rounded shadow-md">
              <h2 className="text-2xl mb-4">Image Details</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Image Caption</label>
                <input
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  type="text"
                  className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring focus:ring-blue-300"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Image Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border border-gray-300 px-3 py-2 rounded-md resize-none focus:ring focus:ring-blue-300"
                  rows="4"
                ></textarea>
              </div>
              <button
                disabled={loading}
                onClick={uploadFileToArweave}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring focus:ring-green-300"
              >
                Upload Image
              </button>
            </div>
       
        </div>
      }

    </div>

    <div>
      <ImageViewer />
    </div>

    </React.Fragment>
  )
}
