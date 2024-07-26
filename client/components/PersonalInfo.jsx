"use client";

import React, { useState } from "react";
import { useGlobalContext } from "../context";

const PersonalInfo = ({ info, setInfo }) => {
  const colorClasses = {
    red: "bg-red-600",
    darkblue: "bg-blue-800",
    orange: "bg-orange-600",
    green: "bg-green-600",
    zinc: "bg-zinc-600",
    indigo: "bg-indigo-600",
    teal: "bg-teal-600",
    purple: "bg-purple-600",
    violet: "bg-violet-600",
    brown: "bg-brown-600",
  };
  const colors = Object.keys(colorClasses);
  const randomNumber = Math.floor(Math.random() * colors.length);
  const { accessToken, uniqueName } = useGlobalContext();
  const [picture, setPicture] = useState(null);
  const [bio, setBio] = useState("");
  const [pronouns, setPronouns] = useState("");
  const [randomColor, setRandomColor] = useState(colors[0]);
  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState("");

  console.log(accessToken);
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(picture, bio, pronouns);

    const formData = new FormData();
    formData.append("picture", picture);
    formData.append("bio", bio);
    formData.append("pronouns", pronouns);

    try {
      let result = await fetch("http://localhost:5000/user/register-personal", {
        method: "POST",
        body: formData,
        credentials: 'include'
      });
      console.log("form Data", formData)
      result = await result.json();
      if (result.status) {
        console.log("Submitted");
        setInfo(!info);
      } else {
        console.log(result.message);
      }
    } catch (error) {
      console.error("Error submitting form", error);
    }
  };

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

  const handleImageRemove = () => {
    setImage(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 text-[#1B1D1D]">
      <div className="flex items-center justify-center">
        <img
          src="../img2.jpeg"
          alt="Sign In Illustration"
          className="shadow-md object-cover h-screen w-full"
        />
      </div>
      <div
        className="flex flex-col p-10 items-center justify-center font-sans"
        style={{
          backgroundImage:
            "linear-gradient(to left, #3e9d83, #007b80, #005873, #00365a, #071537)",
        }}
      >
        <div className="backdrop-blur-md bg-white/40 p-4 rounded-lg">
          <p className="text-xl font-medium">
            We would like to know about you!
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col mt-4">
            <div className="flex gap-x-4">
              {image ? (
                <div className="flex flex-col justify-center items-center gap-y-3">
                  <div className="h-44 w-44 rounded-full relative">
                    <img
                      src={image}
                      alt=""
                      className="object-cover h-44 w-44 rounded-full"
                    />
                  </div>
                  <div className="flex gap-x-2 absolute mt-40">
                    <label
                      htmlFor="file-input"
                      className="px-4 py-2 bg-blue-500 h-10 w-10 rounded-full text-white cursor-pointer text-center hover:bg-blue-700"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        x="0px"
                        y="0px"
                        width="30"
                        height="25"
                        viewBox="0 0 30 30"
                        className="ml-[-10px]"
                      >
                        <path d="M 22.828125 3 C 22.316375 3 21.804562 3.1954375 21.414062 3.5859375 L 19 6 L 24 11 L 26.414062 8.5859375 C 27.195062 7.8049375 27.195062 6.5388125 26.414062 5.7578125 L 24.242188 3.5859375 C 23.851688 3.1954375 23.339875 3 22.828125 3 z M 17 8 L 5.2597656 19.740234 C 5.2597656 19.740234 6.1775313 19.658 6.5195312 20 C 6.8615312 20.342 6.58 22.58 7 23 C 7.42 23.42 9.6438906 23.124359 9.9628906 23.443359 C 10.281891 23.762359 10.259766 24.740234 10.259766 24.740234 L 22 13 L 17 8 z M 4 23 L 3.0566406 25.671875 A 1 1 0 0 0 3 26 A 1 1 0 0 0 4 27 A 1 1 0 0 0 4.328125 26.943359 A 1 1 0 0 0 4.3378906 26.939453 L 4.3632812 26.931641 A 1 1 0 0 0 4.3691406 26.927734 L 7 26 L 5.5 24.5 L 4 23 z"></path>
                      </svg>
                    </label>
                    <button
                      type="button"
                      onClick={handleImageRemove}
                      className="px-4 py-2 bg-red-500 text-white h-10 w-10 rounded-full text-center hover:bg-red-700"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        x="0px"
                        y="0px"
                        width="30"
                        height="25"
                        viewBox="0 0 24 24"
                        className="ml-[-10px]"
                      >
                        <path d="M 10.806641 2 C 10.289641 2 9.7956875 2.2043125 9.4296875 2.5703125 L 9 3 L 4 3 A 1.0001 1.0001 0 1 0 4 5 L 20 5 A 1.0001 1.0001 0 1 0 20 3 L 15 3 L 14.570312 2.5703125 C 14.205312 2.2043125 13.710359 2 13.193359 2 L 10.806641 2 z M 4.3652344 7 L 5.8925781 20.263672 C 6.0245781 21.253672 6.877 22 7.875 22 L 16.123047 22 C 17.121047 22 17.974422 21.254859 18.107422 20.255859 L 19.634766 7 L 4.3652344 7 z"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  className={`h-44 w-44 rounded-full flex justify-center items-center ${colorClasses[randomColor]}`}
                >
                  <span className="text-5xl text-white font-bold">{uniqueName[0]}</span>
                </div>
              )}

              <div className="flex items-center">
                <input
                  type="file"
                  id="file-input"
                  name="image"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                />
                {!imageName && (
                  <label
                    htmlFor="file-input"
                    className="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer text-center hover:bg-blue-700"
                  >
                    Choose File
                  </label>
                )}
                {imageName && (
                  <span className="ml-2 text-lg text-gray-800">{`${imageName.substring(
                    0,
                    10
                  )}...`}</span>
                )}
              </div>
            </div>
            <label className="font-medium">Bio</label>
            <input
              className="bg-transparent border-[#2a5280] mt-2 border-2 rounded p-2"
              type="text"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
            <label className="mt-4 font-medium">Pronouns</label>
            <select
              className="bg-transparent border-[#2a5280] mt-2 border-2 rounded p-2"
              value={pronouns}
              onChange={(e) => setPronouns(e.target.value)}
            >
              <option value="he/him">he/him</option>
              <option value="she/her">she/her</option>
              <option value="others">others</option>
            </select>
            <button
              type="submit"
              className="bg-[#424d88] mt-6 mx-auto w-28 rounded-xl py-2 text-white font-semibold hover:bg-[#d77a2a] transition-colors duration-300"
            >
              {picture || bio || pronouns ? "Next" : "Skip"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;
