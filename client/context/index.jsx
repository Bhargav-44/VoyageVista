"use client";

import React, { useState, useContext, createContext, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const router = useRouter();
  const [accessToken, setAccessToken] = useState("");
  const [uniqueName, setUniqueName] = useState("");
  const [user, setUser] = useState(null);
  const [otherUser, setOtherUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currJournalContent, setCurrJournalContent] = useState({});
  const [edit, setEdit] = useState(false);
  const [tags, setTags] = useState([])
  const [showCreatePost, setShowCreatePost] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
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
          const tagPromises = result.message.tags.map(async (el) => {
            try {
              const result = await fetch("http://localhost:5000/post/getTags", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({ id: el.id, name: el.taggedBy })
              });
              const data = await result.json();
              if (data.status) {
                return { post: data.post, name: data.name };
              }
            } catch (err) {
              console.error("Error fetching tag:", err);
            }
            return null;
          });
    
          const newTags = await Promise.all(tagPromises);
          console.log(newTags);
          const filteredTags = newTags.filter(tag => tag !== null);
          setTags(filteredTags);
          
        } else {
          setError("Try logging in again!!");
        }
      } catch (err) {
        console.log("API call error:", err);
      }
      {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [setUser]);

  return (
    <AppContext.Provider
      value={{
        accessToken,
        setAccessToken,
        uniqueName,
        setUniqueName,
        user,
        setUser,
        otherUser,
        setOtherUser,
        loading,
        setLoading,
        currJournalContent,
        setCurrJournalContent,
        edit,
        setEdit,tags, setTags,
        showCreatePost, setShowCreatePost
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(AppContext);
};

export { AppContext, AppProvider };
