"use client";

import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../../../context";
import { useParams, useRouter } from "next/navigation";
import Navbar from "../../../components/Navbar";
import SeeOthersPost from "../../../components/SeeOthersPost";

const Page = () => {
  const router = useRouter();
  const { id } = useParams();
  const { otherUser, setOtherUser, user, loading, setLoading } =
    useGlobalContext();
  const [selected, setSelected] = useState("POSTS");
  const [error, setError] = useState(null);
  const [showPost, setShowPost] = useState(false);
  const [postDetails, setPostDetails] = useState({});
  const [follow, setFollow] = useState(user?.following.includes(otherUser?.name));
  const [tags, setTags] = useState([]);
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleSelection = (selection) => {
    setSelected(selection);
  };

  const handleFollow = async (e) => {
    e.preventDefault();
    const newState = !follow;
    try {
      let result = await fetch("http://localhost:5000/user/follow", {
        method: "POST",
        body: JSON.stringify({
          otherUserName: otherUser.name,
          follow: newState,
        }),
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      result = await result.json();
      if (result.status) {
        console.log(result.mssg);
        setFollow(newState);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getClassNames = (section) => {
    return section === selected
      ? "text-black border-t-2 border-black py-2 -mt-[10px] "
      : "text-gray-400 opacity-50";
  };

  const updateUser = async () => {
    try {
      const response = await fetch("http://localhost:5000/user/other-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: id }),
      });

      const updatedData = await response.json();
      if (updatedData.status) {
        setOtherUser(updatedData.user);

        const tagPromises = updatedData.user.tags.map(async (el) => {
          try {
            const result = await fetch("http://localhost:5000/post/getTags", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ id: el.id, name: el.taggedBy }),
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
        const filteredTags = newTags.filter((tag) => tag !== null);
        setTags(filteredTags);
      }
    } catch (error) {
      console.error("Error updating user:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    updateUser();
  }, [id, setOtherUser]);

  const handleSeeJournal = (e, el) => {
    e.preventDefault();
    router.push(`/journal/${el.id}`);
  };

  const handleSeePost = (e, el) => {
    e.preventDefault();
    setPostDetails(el);

    setShowPost(true);
  };
  console.log(tags);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen ">
        <svg
          aria-hidden="true"
          className="w-16 h-16 text-gray-200 animate-spin dark:fill-yellow-600"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.20510 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start">
            <div className="w-32 h-32 rounded-full overflow-hidden mb-4 md:mb-0 md:mr-8">
              <img
                src={`../${otherUser?.picture}`}
                alt="Profile Picture"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-grow">
              <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                <p className="text-2xl font-semibold mb-2 md:mb-0">
                  {otherUser?.name}
                </p>
              </div>
              <div className="flex flex-wrap gap-6 mt-2 mb-4">
                <p>
                  <span className="font-bold">{otherUser?.posts?.length}</span>{" "}
                  Posts
                </p>
                <p>
                  <span className="font-bold">
                    {otherUser?.journals?.length}
                  </span>{" "}
                  Journals
                </p>
                <p>
                  <span className="font-bold">
                    {otherUser?.followers?.length}
                  </span>{" "}
                  Followers
                </p>
                <p>
                  <span className="font-bold">
                    {otherUser?.following?.length}
                  </span>{" "}
                  Following
                </p>
              </div>
              <p className="text-gray-700">{otherUser?.bio}</p>
              <button
                className={`mt-2 px-4 p-2 ${
                  follow ? "bg-gray-200" : "bg-blue-200"
                } rounded-md`}
                onClick={handleFollow}
              >
                {follow ? "Unfollow" : "Follow"}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-center space-x-8 mb-6">
            {["POSTS", "JOURNALS", "TAGS"].map((tab) => (
              <button
                key={tab}
                className={`${getClassNames(tab)} font-medium`}
                onClick={() => handleSelection(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {showPost && (
            <SeeOthersPost
              user={user}
              setShowPost={setShowPost}
              postDetails={postDetails}
            />
          )}

          {selected === "POSTS" && (
            <div className="w-full">
              {otherUser?.posts?.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-gray-500 mb-4">Not yet posted!!!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {otherUser?.posts.map((el, i) => (
                    <div
                      key={i}
                      className="aspect-w-1 aspect-h-1 overflow-hidden rounded-lg shadow-md"
                    >
                      <img
                        src={`../posts/${el.picture}`}
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
              {otherUser?.journals?.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-gray-500 mb-4">
                    Not yet made any journal!!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {otherUser?.journals.map((el, i) => (
                    <div
                      key={i}
                      className="flex flex-col sm:flex-row bg-white rounded-lg shadow-md overflow-hidden h-48"
                    >
                      <div className="sm:w-48 h-48 sm:h-auto flex-shrink-0">
                        <img
                          src={`../journal/${el.picture}`}
                          alt={el.title}
                          className="w-full h-full object-cover cursor-pointer"
                          onClick={(e) => handleSeeJournal(e, el)}
                        />
                      </div>
                      <div className="flex-grow p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h3
                            className="text-xl font-semibold text-gray-800 cursor-pointer"
                            onClick={(e) => handleSeeJournal(e, el)}
                          >
                            {el.title}
                          </h3>
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
                        src={`../posts/${el.post.picture}`}
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
