"use client";

import React, { useState } from "react";
import { useGlobalContext } from "../../context";
import CreatePost from "../../components/CreatePost";
import SeePost from "../../components/SeePost";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";

const Page = () => {
  const router = useRouter();
  const {
    user,
    setUser,
    currJournalContent,
    setCurrJournalContent,
    edit,
    setEdit,
    tags,
    setTags,
    showCreatePost, setShowCreatePost
  } = useGlobalContext();
  const [selected, setSelected] = useState("POSTS");
  const [error, setError] = useState(null);
  
  const [showPost, setShowPost] = useState(false);
  const [postDetails, setPostDetails] = useState({});

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleSelection = (selection) => {
    setSelected(selection);
  };

  const getClassNames = (section) => {
    return section === selected
      ? "text-indigo-600 border-b-2 border-indigo-600 py-2"
      : "text-gray-500 hover:text-indigo-600 transition duration-300";
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-4">
        <p>{error}</p>
      </div>
    );
  }

  const handlePost = (e) => {
    e.preventDefault();
    setShowCreatePost(true);
  };

  const handleSeePost = (e, el) => {
    e.preventDefault();
    setPostDetails(el);
    setShowPost(true);
  };

  const handleJournal = (e, el) => {
    e.preventDefault();
    router.push(`/journal/${el.id}`);
  };

  const handleCreateJournal = (e) => {
    e.preventDefault();
    router.push("/journal");
  };

  const handleDelete = async (e, id) => {
    e.preventDefault();
    try {
      let result = await fetch("http://localhost:5000/journal/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
        credentials: "include",
      });
      result = await result.json();
      if (result.status) {
        console.log(result.mssg);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleEdit = async (e, id) => {
    e.preventDefault();
    setEdit(!edit);
    try {
      let result = await fetch("http://localhost:5000/journal", {
        method: "POST",
        body: JSON.stringify({ id }),
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      result = await result.json();
      if (result.status) {
        setCurrJournalContent(result.journal[0]);
        router.push("/journal");
      }
    } catch (err) {
      console.log(err);
    }
  };
  console.log(postDetails);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start">
            <div className="w-32 h-32 rounded-full overflow-hidden mb-4 md:mb-0 md:mr-8">
              <img
                src={`../${user?.picture}`}
                alt="Profile Picture"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-grow">
              <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                <p className="text-2xl font-semibold mb-2 md:mb-0">
                  {user?.name}
                </p>
                
              </div>
              <div className="flex flex-wrap gap-6 mt-2 mb-4">
                <p>
                  <span className="font-bold">{user?.posts?.length}</span> Posts
                </p>
                <p>
                  <span className="font-bold">{user?.journals?.length}</span>{" "}
                  Journals
                </p>
                <p>
                  <span className="font-bold">{user?.followers?.length}</span>{" "}
                  Followers
                </p>
                <p>
                  <span className="font-bold">{user?.following?.length}</span>{" "}
                  Following
                </p>
              </div>
              <p className="text-gray-700">{user?.bio}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-center space-x-8 mb-6">
            {["POSTS", "JOURNALS", "LIST", "TAGS"].map((tab) => (
              <button
                key={tab}
                className={`${getClassNames(tab)} font-medium`}
                onClick={() => handleSelection(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {showCreatePost && (
            <CreatePost setShowCreatePost={setShowCreatePost} />
          )}

          {showPost && (
            <SeePost
              user={user}
              setShowPost={setShowPost}
              postDetails={postDetails}
            />
          )}

          {selected === "POSTS" && (
            <div className="w-full">
              {user?.posts?.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-gray-500 mb-4">
                    Start with your first post
                  </p>
                  <button
                    onClick={handlePost}
                    className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition duration-300"
                  >
                    Create Post
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {user?.posts.map((el, i) => (
                    <div
                      key={i}
                      className="aspect-w-1 aspect-h-1 overflow-hidden rounded-lg shadow-md"
                    >
                      <img
                        src={`./posts/${el.picture}`}
                        alt="Post"
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105 cursor-pointer"
                        onClick={(e) => handleSeePost(e, el)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {selected === "JOURNALS" && (
            <div className="w-full">
              {user?.journals?.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-gray-500 mb-4">
                    Start with your first journal
                  </p>
                  <button
                    onClick={handleCreateJournal}
                    className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition duration-300"
                  >
                    Create Journal
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {user?.journals.map((el, i) => (
                    <div
                      key={i}
                      className="flex flex-col sm:flex-row bg-white rounded-lg shadow-md overflow-hidden"
                    >
                      <div className="sm:w-48 h-48 sm:h-auto flex-shrink-0">
                        <img
                          src={`./journal/${el.picture}`}
                          alt={el.title}
                          className="w-full h-full object-cover cursor-pointer"
                          onClick={(e) => handleJournal(e, el)}
                        />
                      </div>
                      <div className="flex-grow p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h3
                            className="text-xl font-semibold text-gray-800 cursor-pointer"
                            onClick={(e) => handleJournal(e, el)}
                          >
                            {el.title}
                          </h3>
                          <div className="space-x-2 relative inline-block">
                            <button
                              className="transition duration-300 relative group"
                              onClick={(e) => handleEdit(e, el.id)}
                            >
                              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full bg-gray-800 text-white text-xs p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                Edit
                              </span>
                              <img
                                src="./edit-icon.svg"
                                alt=""
                                className="w-8 h-8"
                              />
                              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full bg-gray-800 text-white text-xs p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                Edit
                              </span>
                            </button>
                            <button
                              className="transition duration-300 relative group"
                              onClick={(e) => handleDelete(e, el.id)}
                            >
                              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full bg-gray-800 text-white text-xs p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                Delete
                              </span>
                              <img
                                src="./delete-icon.svg"
                                alt=""
                                className="w-6 h-6 mb-1"
                              />
                              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full bg-gray-800 text-white text-xs p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                Delete
                              </span>
                            </button>
                          </div>
                        </div>
                        <p className="text-gray-500 mb-2">
                          {formatDate(el.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {selected === "LIST" && (
            <div className="w-full">
              {user?.list?.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-gray-500">
                    Start reading experiences today.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {user?.list.map((el, i) => (
                    <div
                      key={i}
                      className="relative aspect-w-1 aspect-h-1 overflow-hidden rounded-lg shadow-md cursor-pointer"
                      onClick={(e) => handleJournal(e, el)}
                    >
                      <img
                        src={`./journal/${el.picture}`}
                        alt={el.title}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2">
                        <p className="text-center truncate">{el.title}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {selected === "TAGS" && (
            <div className="w-full">
              {tags.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-gray-500">No one tagged yet!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {tags.map((el, i) => (
                    <div
                      key={i}
                      className="relative aspect-w-1 aspect-h-1 overflow-hidden rounded-lg shadow-md"
                    >
                      <img
                        src={`./posts/${el.post.picture}`}
                        alt="Tagged post"
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105 cursor-pointer"
                        onClick={(e) => handleSeePost(e, el)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
