"use client";

import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";
import { useGlobalContext } from "../context";

const CreatePost = ({ setShowCreatePost }) => {
  const router = useRouter();
  const { user } = useGlobalContext();
  const [picture, setPicture] = useState(null);
  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState("");
  const [caption, setCaption] = useState("");
  const [showPeopleList, setShowPeopleList] = useState(false);
  const [tags, setTags] = useState([]);
  const [currentTagPosition, setCurrentTagPosition] = useState({ x: 0, y: 0 });

  const id = uuidv4();

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

  const handleImageClick = (e) => {
    const rect = e.target.getBoundingClientRect();
    setCurrentTagPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setShowPeopleList(true);
  };

  const handleTagSelect = (name) => {
    setTags([...tags, { name, ...currentTagPosition }]);
    setShowPeopleList(false);
  };

  const handleDrag = (e, index) => {
    const rect = e.target.parentNode.getBoundingClientRect();
    const updatedTags = [...tags];
    updatedTags[index] = {
      ...updatedTags[index],
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    setTags(updatedTags);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    console.log(tags)
    formData.append("id", id);
    formData.append("picture", picture);
    formData.append("caption", caption);
    formData.append("tags", JSON.stringify(tags));
    try {
      console.log(typeof id, picture, caption);
      let result = await fetch("http://localhost:5000/post", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      console.log("API is getting called");
      result = await result.json();
      console.log("API response:", result);
      if (result.status) {
        setShowCreatePost(false);
      }
    } catch (err) {
      console.log("API call error:", err);
    }
  };

  console.log(user.following)

  return (
    <div className="absolute top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <form className="bg-white p-6 rounded-lg shadow-md w-96 relative">
        <button
          type="button"
          className="absolute top-0 right-0 mr-2"
          onClick={() => setShowCreatePost(false)}
        >
          X
        </button>
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
          <div className="relative">
            <img
              src={image}
              alt=""
              className="object-cover h-44 w-full mb-4 rounded"
              onClick={handleImageClick}
            />
            {tags.map((tag, index) => (
              <div
                key={index}
                className="absolute bg-white p-1 rounded shadow-lg cursor-pointer"
                style={{ left: `${tag.x}px`, top: `${tag.y}px` }}
                onMouseDown={(e) => e.preventDefault()}
                onDrag={(e) => handleDrag(e, index)}
                draggable
              >
                {tag.name}
              </div>
            ))}
          </div>
        )}
        {showPeopleList && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setShowPeopleList(false)}
            ></div>
            <div className="absolute z-20 w-full mt-1 bg-white border rounded shadow-lg">
              {user.following.map((el, i) => (
                <div
                  key={i}
                  className="w-full mt-1 bg-white border rounded shadow-lg cursor-pointer"
                  onClick={() => handleTagSelect(el)}
                >
                  <p>{el}</p>
                </div>
              ))}
            </div>
          </>
        )}

        <input
          type="text"
          value={caption}
          placeholder="Enter Caption..."
          onChange={(e) => setCaption(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />
        <button
          type="submit"
          className="w-full py-2 bg-green-500 text-white rounded hover:bg-green-700"
          onClick={(e) => {
            e.preventDefault();
            handleSubmit(e);
          }}
        >
          Post
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
