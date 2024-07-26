"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useGlobalContext } from "../context";

const SignIn = ({ sign, setSign }) => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState("");
  const { setAccessToken, accessToken, user, setUser } = useGlobalContext();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(name, password);
    let result = await fetch("http://localhost:5000/user/login", {
      method: "POST",
      body: JSON.stringify({ name, password }),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    result = await result.json();

    setName("");
    setPassword("");
    if (result.success) {
      console.log(result);
      await setAccessToken(result.message);
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
    } else {
      setAlert(result.message);

      setTimeout(() => {
        setAlert("");
      }, 2000);
    }
  };

  console.log(user);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 text-[#1B1D1D]">
      <div
        className="flex flex-col p-6 justify-center font-sans"
        style={{
          backgroundImage:
            "linear-gradient(to right, #3e9d83, #007b80, #005873, #00365a, #071537)",
        }}
      >
        {alert && (
          <p className="text-red-600 text-xl font-semibold border border-red-600 bg-red-100 p-3 rounded-lg shadow-md">
            {alert}
          </p>
        )}

        <div className="backdrop-blur-md bg-white/40 p-4 rounded-lg">
          <p className="text-2xl font-semibold mb-2">Welcome Back!👋</p>
          <p className="text-xl font-medium">
            Today is a new day. It's your day. You shape it.
          </p>
          <p className="text-xl font-medium">
            Sign in to continue your adventure.
          </p>
          <form
            onSubmit={(e) => handleSubmit(e)}
            className="flex flex-col mt-4"
          >
            <label className="font-medium">Name</label>
            <input
              className="bg-transparent border-[#2a5280] mt-2 border-2 rounded p-2"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <label className="font-medium mt-2">Password</label>
            <div className="relative">
              <input
                className="bg-transparent border-[#2a5280] mt-2 border-2 rounded p-2 w-full"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#2a5280] hover:text-[#d77a2a]"
                onClick={() => setShowPassword(!showPassword)}
              >
                {!showPassword ? (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 mt-2"
                  >
                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      {" "}
                      <path
                        d="M15.0007 12C15.0007 13.6569 13.6576 15 12.0007 15C10.3439 15 9.00073 13.6569 9.00073 12C9.00073 10.3431 10.3439 9 12.0007 9C13.6576 9 15.0007 10.3431 15.0007 12Z"
                        stroke="#000000"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>{" "}
                      <path
                        d="M12.0012 5C7.52354 5 3.73326 7.94288 2.45898 12C3.73324 16.0571 7.52354 19 12.0012 19C16.4788 19 20.2691 16.0571 21.5434 12C20.2691 7.94291 16.4788 5 12.0012 5Z"
                        stroke="#000000"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>{" "}
                    </g>
                  </svg>
                ) : (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 mt-2"
                  >
                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      {" "}
                      <path
                        d="M2.99902 3L20.999 21M9.8433 9.91364C9.32066 10.4536 8.99902 11.1892 8.99902 12C8.99902 13.6569 10.3422 15 11.999 15C12.8215 15 13.5667 14.669 14.1086 14.133M6.49902 6.64715C4.59972 7.90034 3.15305 9.78394 2.45703 12C3.73128 16.0571 7.52159 19 11.9992 19C13.9881 19 15.8414 18.4194 17.3988 17.4184M10.999 5.04939C11.328 5.01673 11.6617 5 11.9992 5C16.4769 5 20.2672 7.94291 21.5414 12C21.2607 12.894 20.8577 13.7338 20.3522 14.5"
                        stroke="#000000"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>{" "}
                    </g>
                  </svg>
                )}
              </button>
            </div>
            <button className="bg-[#424d88] mt-6 mx-auto w-28 rounded-xl py-2 text-white font-semibold hover:bg-[#d77a2a] transition-colors duration-300">
              Sign In
            </button>
            <p
              className="text-center mt-2 text-black cursor-pointer hover:text-white"
              onClick={() => setSign(!sign)}
            >
              Create an account...
            </p>
          </form>
        </div>
      </div>
      <div className="flex items-center justify-center">
        <img
          src="../img2.jpeg"
          alt="Sign In Illustration"
          className=" shadow-md object-cover h-screen w-full"
        />
      </div>
    </div>
  );
};

export default SignIn;
