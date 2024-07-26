"use client";

import React, { useState, useTransition } from "react";
import { useGlobalContext } from "../context";
import { useRouter } from "next/navigation";
import Select from "react-select";
import  countries  from "./countries";

const TravelInfo = () => {
  const router = useRouter();
  const { accessToken, setUser, user, fetchDetails } = useGlobalContext();
  const [places, setPlaces] = useState("");
  const [style, setStyle] = useState("");
  const [budget, setBudget] = useState("");
  console.log(accessToken);

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(places.map(e => e.value))
    const destination = places.map(e=>e.value)
    try {
      let result = await fetch("http://localhost:5000/user/register-travel", {
        method: "POST",
        body: JSON.stringify({ destination, style, budget }),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      result = await result.json();
      if (result.status) {
        try {
          let result = await fetch(
            "http://localhost:5000/user/personal-profile",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
            }
          );
          console.log("API is getting called");
          result = await result.json();
          console.log("API response:", result);
          if (result.status) {
            setUser(result.message);
            router.push("/travelHome");
          }
        } catch (err) {
          console.log("API call error:", err);
        }
      }
    } catch (err) {
      console.error("Error submitting form", err);
    }
  };

  console.log(user);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 text-[#1B1D1D]">
      <div className="flex items-center justify-center">
        <img
          src="../img2.jpeg"
          alt="Sign In Illustration"
          className=" shadow-md object-cover h-screen w-full"
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
            Tell us about your preferences!!
          </p>
          <form
            onSubmit={(e) => handleSubmit(e)}
            className="flex flex-col mt-4"
          >
            <label className="font-medium">Destinations</label>
            

            <Select
              isMulti
              name="countries"
              options={countries}
              className="basic-multi-select bg-transparent border-[#2a5280] mt-2 border-2 rounded p-2"
              classNamePrefix="select"
              value={places}
              onChange={(selectedOptions) => setPlaces([...new Set([...places, ...selectedOptions])])}
            />

            <label className="font-medium mt-2">Style</label>
            <select
              className="bg-transparent border-[#2a5280] mt-2 border-2 rounded p-2"
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              required
            >
              {/* <option value="">Travel Style</option> */}
              <option value="Adventure">Adventure</option>
              <option value="Cultural">Cultural</option>
              <option value="Luxury">Luxury</option>
            </select>
            <label className="mt-4 font-medium">Budget Range</label>
            <select
              className="bg-transparent border-[#2a5280] mt-2 border-2 rounded p-2"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              required
            >
              {/* <option value="">Select your pronouns</option> */}
              <option value="Budget">Budget</option>
              <option value="Mid-range">Mid-range</option>
              <option value="Luxury">Luxury</option>
            </select>
            <button className="bg-[#424d88] mt-6 mx-auto w-28 rounded-xl py-2 text-white font-semibold hover:bg-[#d77a2a] transition-colors duration-300">
              Next
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TravelInfo;
