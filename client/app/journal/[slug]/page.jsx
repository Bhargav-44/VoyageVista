"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { useGlobalContext } from "../../../context";
import "react-quill/dist/quill.bubble.css";
import Navbar from "../../../components/Navbar";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const CommentSection = ({ isOpen, onClose, comments, onSubmit }) => {
  const [comment, setComment] = useState("");

  return (
    <div
      className={`fixed top-16 right-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="p-4">
        <button onClick={onClose} className="mb-4">
          &times; Close
        </button>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(comment);
            setComment("");
          }}
          className="mb-4"
        >
          <textarea
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          ></textarea>
          <button
            type="submit"
            className="mt-2 p-2 bg-blue-500 text-white rounded w-full"
          >
            Add Comment
          </button>
        </form>
        <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
          {comments && comments.length > 0 ? (
            comments.map((el, i) => (
              <div key={i} className="flex gap-2 items-center mb-2">
                <img
                  src={`../${el.img}`}
                  alt=""
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="font-semibold">{el.name}</p>
                  <p className="text-sm">{el.comment}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No comments yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

const Page = () => {
  const { slug } = useParams();
  const { user } = useGlobalContext();
  const [details, setDetails] = useState({});
  const [currName, setCurrName] = useState("");
  const [img, setImg] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [readingTime, setReadingTime] = useState(0)
  const [hasDownvoted, setHasDownvoted] = useState(false);
  const [isCommentSectionOpen, setIsCommentSectionOpen] = useState(false);

  const toggleCommentSection = () => {
    setIsCommentSectionOpen(!isCommentSectionOpen);
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const calculateReadingTime = (content) => {
    const wordsPerMinute = 200; // Average reading speed
    const wordCount = content.trim().split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    return readingTime;
  };

  const handleSubmit = async (commentText) => {
    try {
      let result = await fetch("http://localhost:5000/journal/comment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: slug, comment: commentText }),
        credentials: "include",
      });

      result = await result.json();
      if (result.status) {
        console.log("Comment Added");
        fetchDetails(); // Refresh the details to show the new comment
      } else {
        console.error("Failed to add comment:", result.mssg);
      }
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  const handleUpVote = async (e) => {
    e.preventDefault();
    try {
      let result = await fetch("http://localhost:5000/journal/upvote", {
        method: "POST",
        body: JSON.stringify({ id: slug }),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!result.ok) {
        throw new Error(`HTTP error! status: ${result.status}`);
      }

      result = await result.json();
      if (result.status) {
        console.log(result.mssg);
        setHasUpvoted(!hasUpvoted);
        if (hasDownvoted) setHasDownvoted(false);
        fetchDetails();
      } else {
        console.error("Failed to upvote:", result.mssg);
      }
    } catch (err) {
      console.error("Error upvoting:", err);
    }
  };

  const handleBookmark = async (e) => {
    e.preventDefault();
    try{
      let result = await fetch("http://localhost:5000/journal/bookmark", {
        method: "POST",
        body: JSON.stringify({ id: slug }),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!result.ok) {
        throw new Error(`HTTP error! status: ${result.status}`);
      }

      result = await result.json();
      if (result.status) {
        console.log("Bookmarked");
      } else {
        console.error("Failed to bookmark:", result.mssg);
      }
    } catch(err) {  
      console.log(err)
    }
  }

  const handleDownVote = async (e) => {
    e.preventDefault();
    try {
      let result = await fetch("http://localhost:5000/journal/downvote", {
        method: "POST",
        body: JSON.stringify({ id: slug }),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!result.ok) {
        throw new Error(`HTTP error! status: ${result.status}`);
      }

      result = await result.json();
      if (result.status) {
        console.log("downvoted");
        setHasDownvoted(!hasDownvoted);
        if (hasUpvoted) setHasUpvoted(false);
        fetchDetails();
      } else {
        console.error("Failed to downvote:", result.mssg);
      }
    } catch (err) {
      console.error("Error downvoting:", err);
    }
  };

  const fetchDetails = async () => {
    try {
      setIsLoading(true);
      let result = await fetch("http://localhost:5000/journal", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ id: slug }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!result.ok) {
        throw new Error(`HTTP error! status: ${result.status}`);
      }
      result = await result.json();
      console.log(result)
      if (result.status) {
        setDetails(result.journal[0] || {});
        setReadingTime(calculateReadingTime(result.journal[0].content));
        setCurrName(result.name || "Anonymous");
        setImg(result.img || "");
        setHasUpvoted(result.journal[0].upvote.includes(user?.name));
        setHasDownvoted(result.journal[0].downvote.includes(user?.name));
      } else {
        console.error("Failed to fetch journal details:", result.mssg);
      }
    } catch (err) {
      console.error("Error fetching journal details:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [slug, user]);

  if (isLoading) {
    return (<div>
      <Navbar />
      <div className="flex items-center justify-center h-screen ">
        <svg
          aria-hidden="true"
          className="w-16 h-16 text-gray-200 animate-spin dark: fill-yellow-600"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
      </div>
    </div>
      
    );
  }

  if (!details || Object.keys(details).length === 0) {
    return <div className="text-center mt-8">Journal not found</div>;
  }

  console.log(details)

  return (
    <div>
      <Navbar />
      <div className="container mx-auto py-8 relative">
      <div className="flex flex-col items-center">
        <style jsx global>{`
          .ql-editor img {
            max-width: 100%;
            height: auto;
          }
        `}</style>
        <p className="font-bold text-4xl mb-4 max-w-3xl text-center">
          {details.title}
        </p>
        <div className="flex flex-col w-full max-w-3xl mb-4 ml-[10px]">
          <div className="flex items-center gap-2 ml-[6px] mb-2 border-b border-gray-300 pb-2">
            <img
              src={img ? `../${img}` : "../default-avatar.png"}
              className="w-10 h-10 rounded-full overflow-hidden"
              alt="User avatar"
            />
            <div className="flex flex-col">
            <p className="text-xl">{currName}</p>
            <div className="flex gap-1">
            <p className="text-gray-500">{readingTime} min read</p>
            <span className="text-gray-500 mt-[-10px] text-2xl">.</span>
            <p className="text-gray-500 mb-2">{formatDate(details.createdAt)}</p>
            </div>
            </div>
          </div>
          <div className="flex items-center justify-between ml-[10px] mb-4 border-b border-gray-300 pb-2">
            <div className="flex items-center">
              <button onClick={handleUpVote}>
                <img
                  src={hasUpvoted ? "../upvote-1.svg" : "../upvote.svg"}
                  alt=""
                  className="w-6 h-6"
                />
              </button>
              <p>{details.upvote?.length || 0}</p>
              <button className="ml-2" onClick={handleDownVote}>
                <img
                  src={hasDownvoted ? "../upvote-1.svg" : "../upvote.svg"}
                  alt=""
                  className="w-6 h-6 mt-1 rotate-180"
                />
              </button>
              <p>{details.downvote?.length || 0}</p>
              <button className="ml-4" onClick={toggleCommentSection}>
                <img src="../comment.svg" alt="" className="w-5 h-5" />
              </button>
            </div>
            <button className="mr-4" onClick={handleBookmark}>
              <img src="../save.svg" alt="" className="w-5 h-6" />
            </button>
          </div>
        </div>

        <div className="w-full max-w-3xl mb-4">
          <ReactQuill
            value={details.content}
            readOnly={true}
            theme={"bubble"}
          />
        </div>

        <CommentSection
          isOpen={isCommentSectionOpen}
          onClose={() => setIsCommentSectionOpen(false)}
          comments={details.comment}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
    </div>
    
  );
};

export default Page;
