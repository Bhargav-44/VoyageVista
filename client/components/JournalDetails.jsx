"use client";

import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";
import { useGlobalContext } from "../context";

const JournalDetails = ({ renderedContent }) => {
  const router = useRouter();
  const {edit, currJournalContent} = useGlobalContext();
  const [picture, setPicture] = useState(null);
  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState("");
  const [title, setTitle] = useState("");
  const id = uuidv4();

  useEffect(() => {
    setTitle(currJournalContent.title);
    setImage(currJournalContent.image)
  },[edit, currJournalContent])

  const handleImageChange = (event) => {
    if (event.target.files.length > 0) {
      const uploadedFile = event.target.files[0];
      setPicture(uploadedFile);
      const reader = new FileReader();

      reader.onloadend = () => {
        setImage(reader.result);
      };

      reader.readAsDataURL(uploadedFile);

      const fullPath = event.target.value;
      const lastSlashIndex = Math.max(
        fullPath.lastIndexOf("/"),
        fullPath.lastIndexOf("\\")
      );
      const fileName = fullPath.substring(lastSlashIndex + 1);
      setImageName(fileName);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('clicked')
    

    // console.log(formData)
    if(!edit){
      const formData = new FormData();
    formData.append("id", id);
    formData.append("content", renderedContent);
    formData.append("picture", picture);
    formData.append("title", title);
    try {
      
      let result = await fetch("http://localhost:5000/journal/save", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      console.log("API is getting called");
      result = await result.json();
      if (result.status) {
          console.log("API response:", result);
          router.push("/profile")

      }
      
    } catch (err) {
      console.log("API call error:", err);
    }} else {
      const formData = new FormData();
    formData.append("id", currJournalContent.id);
    formData.append("content", renderedContent);
    formData.append("picture", picture);
    formData.append("title", title);
      try{
        let result = await fetch("http://localhost:5000/journal/update", {
          method: "POST",
          body: formData,
          credentials: "include",
        });
        console.log("API is getting called");
        result = await result.json();
        if (result.status) {
            console.log("API response:", result);
            router.push("/profile")
  
        }
      } catch(err) {
        console.log(err)
      }
    }
  };

  return (
    <div className="absolute top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex items-center justify-center">
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-96 relative">
        <input
          type="file"
          id="file-input"
          name="image"
          onChange={handleImageChange}
          className="hidden"
        />
        {!imageName && (
          <label
            htmlFor="file-input"
            className="block w-full py-2 bg-blue-500 text-white text-center rounded cursor-pointer hover:bg-blue-700 mb-4"
          >
            Choose File
          </label>
        )}
        {image && (
          <img
            src={image}
            alt=""
            className="object-cover h-44 w-full mb-4 rounded"
          />
        )}
        <input
          type="text"
          value={title}
          placeholder="Enter Title..."
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />
        <button
          type="submit"
          className="w-full py-2 bg-green-500 text-white rounded hover:bg-green-700"
        >
          Post
        </button>
      </form>
    </div>
  );
};

export default JournalDetails;
