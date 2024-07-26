const express = require("express");
const router = express.Router();
const createError = require("http-errors");
const path = require("path");
const User = require("../models/User");
const multer = require("multer");
const { truncate } = require("fs");
const { getNamefromToken } = require("../helper/middleware");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "../client/public/posts");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

router.post("/", upload.single("picture"), async (req, res, next) => {
  const { id, caption, tags } = req.body;
  const picture = req.file.filename;
  const accessToken = req.cookies.token;
  try {
    console.log(id, caption, picture);
    if (!accessToken) return res.status(401).json({ mssg: "Not a valid token" });
    
    const name = await getNamefromToken(accessToken);
    const user = await User.findOne({ name });
    
    if (!user) return res.status(404).json({ mssg: "User not found" });

    const parsedTags = JSON.parse(tags);

    const newPost = {
      id: id,
      picture: picture,
      caption: caption,
      tags: parsedTags,
    };
    console.log(newPost);
    
    user.posts.push(newPost);
    await user.save();

    const updateTaggedUsers = parsedTags.map(async (taggedUsername) => {
      const otherUser = await User.findOne({ name: taggedUsername.name });
      if (otherUser) {
        otherUser.tags.push({
          id: id,
          taggedBy: user.name
        });
        return otherUser.save();
      }
    });

    await Promise.all(updateTaggedUsers);

    res.status(200).json({ status: true, mssg: "Post uploaded and tags updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mssg: err.message });
  }
});

router.post("/getTags", async(req, res, next) => {
  const {id, name} = req.body;
  try {
    const user = await User.findOne({name});
    const post = user.posts.find((obj) => obj.id === id);
    res.status(200).json({status: true, post:post, name: user.name});
  } catch(err) {
    res.status(500).json({mssg:err.message})
  }
})

router.post("/like", async (req, res, next) => {
  const { id, liked} = req.body;
  console.log(id, liked);
  const accessToken = req.cookies.token;
  console.log(accessToken);
  try {
    if (!accessToken) res.status(501).json({ mssg: "Login first!!" });
    const name = await getNamefromToken(accessToken);
    // console.log(name, otherUserName)
    const user = await User.findOne({"posts.id": id });
    console.log(user)
    const post = user.posts.find((obj) => obj.id === id);
    if (liked) {
      post.likes.push(name);
    } else {
      post.likes.remove(name);
    }
    await user.save()
    console.log(post);
    res.send({ status: true, mssg: "Like updated" });
  } catch (err) {
    res.status(500).json({ mssg: err.message });
  }
});

router.post("/comment", async (req, res, next) => {
  const { id, comment} = req.body;

  const accessToken = req.cookies.token;

  try {
    if (!accessToken) res.status(501).json({ mssg: "Login first!!" });
    const name = await getNamefromToken(accessToken);
    const user = await User.findOne({ "posts.id" : id});
    const currUser = await User.findOne({name})
  
    const post = user.posts.find((obj) => obj.id === id);
    const updateData = {
      "name" : name,
      "comment" : comment,
      "createdAt" : Date.now(),
      "img" : currUser.picture
    }
    post.comments.push(updateData);
    await user.save();
    console.log(post);
    res.send({ status: true, mssg: "Comment updated" });
  } catch (err) {
    res.status(500).json({ mssg: err.message });
  }
});

module.exports = router;
