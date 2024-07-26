'use client';

import React, { useState } from "react";

const SeePost = ({ user, setShowPost, postDetails }) => {
  let id = postDetails.id;
  const [liked, setLiked] = useState(postDetails.likes.includes(user.name));
  const [comment, setComment] = useState("");
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [showTags, setShowTags] = useState(false); // State to toggle tag visibility

  console.log(postDetails)
  const handleComment = async (e) => {
    e.preventDefault();
    console.log(id, comment);
    try {
      let result = await fetch("http://localhost:5000/post/comment", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ id, comment }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      result = await result.json();
      if (result.status) {
        console.log(result.mssg);
      } else {
        console.log("Failed to add comment:", result.mssg);
      }
    } catch (err) {
      console.log("Error:", err);
    }
  };

  const handleLike = async (e) => {
    e.preventDefault();
    const newLikedState = !liked; // Calculate the new liked state before setting it
    console.log(id, newLikedState);
    try {
      let result = await fetch("http://localhost:5000/post/like", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ id, liked: newLikedState}),
        headers: {
          "Content-Type": "application/json",
        },
      });

      result = await result.json();
      if (result.status) {
        setLiked(newLikedState); // Update the state after the request is successful
        console.log(result.mssg);
      } else {
        console.log("Failed to like post:", result.mssg);
      }
    } catch (err) {
      console.log(err);
    }
  };

  console.log(postDetails)
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 h-5/6 rounded-lg shadow-md relative w-full max-w-lg overflow-auto">
        <button
          onClick={() => setShowPost(false)}
          className="absolute right-0 top-0 mr-2 mt-1 text-red-500"
        >
          X
        </button>
        <div className="relative">
          <img
            src={`./posts/${postDetails.picture}`}
            alt=""
            className="w-full h-auto mb-2 rounded-lg"
          />
          {showTags && postDetails.tags.map((tag, index) => (
            <div
              key={index}
              className="absolute"
              style={{ left: `${tag.x}px`, top: `${tag.y}px` }}
            >
              <span className="bg-gray-400 p-1 rounded">{tag.name}</span>
            </div>
          ))}
          {postDetails.tags?.length > 0  &&  <button
            className="absolute bottom-2 right-2 p-2  bg-gray-400 text-white rounded-full"
            onClick={() => setShowTags(!showTags)}
          >
            <img src="./tag.svg" alt="" className="w-4 h-4"/>
          </button>}
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img
              src={liked ? "./red-heart.svg" : "./like.svg"}
              className={`${liked ? "w-8 h-8 mt-1 ml1" : "w-10 h-10"} cursor-pointer`}
              alt="like"
              onClick={handleLike} // Directly pass the handler without arrow function
            />
            <img
              src={"./comment.svg"}
              className="w-8 h-8 cursor-pointer"
              alt="comment"
              onClick={() => setShowCommentInput(!showCommentInput)}
            />
          </div>
        </div>
        <div className="flex gap-2 items-center mb-4">
          <p className="font-semibold">{user.name}</p>
          <p className="">{postDetails.caption}</p>
        </div>

        <div>
          {postDetails.comments.map((el, i) => (
            <div key={i} className="flex gap-2 items-center mb-2">
              <img src={el.img} alt="" className="w-10 h-10 rounded-full" />
              <div>
                <p className="font-semibold">{el.name}</p>
                <p className="text-sm">{el.comment}</p>
              </div>
            </div>
          ))}
          {showCommentInput && (
            <div>
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add comment...."
              />
              <button onClick={handleComment}>Comment</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SeePost;
