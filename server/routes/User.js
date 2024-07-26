const express = require("express");
const router = express.Router();
const createError = require("http-errors");
const path = require("path");
const bcrypt = require("bcrypt");
const User = require("../models/User");

const { setAccessToken, getNamefromToken } = require("../helper/middleware");

const { signAccessToken,verifyAccessToken } = require("../helper/jwt_helper");

const multer = require("multer");
const { truncate } = require("fs");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "../client/public");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({ storage: storage });

router.get("/", async (req, res, next) => {
  try {
    const result = await User.find({}, { __v: 0 });
    res.send({status: true, user:result});
  } catch (error) {
    console.log(error.message);
  }
});

router.post("/other-user", async (req, res, next) => {
  try {
    const {name} = req.body;
    console.log(name)
    const result = await User.findOne({name}, { __v: 0 });
    res.send({status: true, user:result});
  } catch (error) {
    console.log(error.message);
  }
});

router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const user = new User(req.body);
    const exists = await User.findOne({
      name: name,
    });
    if (exists) {
      res.send({
        success: false,
        message: "Username already exists. Try a different username.",
      });
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const result = await User.create({
        name: name,
        email: email,
        password: hashedPassword,
      });

      const accessToken = await signAccessToken(req.body.name);
      
      res.cookie("token", accessToken, {httpOnly:true, secure: true})
      res.send({ success: true, message: accessToken, name: name });
      console.log(accessToken);
    }
  } catch (err) {
    console.log(err.message);
  }
});

router.post("/personal-profile", async (req, res, next) => {
  try {
    // console.log('called')
    
    const  accessToken  = req.cookies.token;
    
    if (!accessToken) {
      return res.status(401).json({ status: false, message: 'No token provided' });
    }
    const name = await getNamefromToken(accessToken);
    
    
    const user = await User.findOne({ name: name });
    res.send({ status: true, message: user });
  } catch (err) {
    res.send(err);
  }
});

router.post("/register-personal",upload.single("picture"),async (req, res) => {
    const { bio, pronouns } = req.body;
    const accessToken = req.cookies.token;
    console.log("personal:", accessToken)
    console.log(req)
    const picture = req.file.filename;
    try {
      const updateData = {
        bio,
        pronouns,
        picture,
      };

      const name = await getNamefromToken(accessToken);
      const user = await User.findOneAndUpdate({ name }, updateData);
      await user.save();
      res
        .status(200)
        .json({ status: true, message: "Profile submitted successfully" });
    } catch (error) {
      res.status(500).json({ statuse: false, message: "Error saving user" });
    }
  }
);

router.post("/register-travel", async (req, res, next) => {
  try {
    const { destination, style, budget } = req.body;
    const accessToken = req.cookies.token;
    console.log("travel:", accessToken)
    const updateData = {
      destination,
      style,
      budget,
    };
    const name = await getNamefromToken(accessToken);
    const user = await User.findOneAndUpdate({ name }, updateData);
    await user.save();
    res
      .status(200)
      .json({ status: true, message: "Profile submitted successfully" });
  } catch (err) {
    console.log(err.message);
  }
});

router.post("/follow", async(req, res, next) => {
  try{
    console.log('called')
    const {otherUserName, follow} = req.body;
    const accessToken = req.cookies.token;
    if (!accessToken) res.status(401).json({ status: false, message: 'No token provided' });
    const name = await getNamefromToken(accessToken);
    const curUser = await User.findOne({name});
    const user = await User.findOne({name: otherUserName});

    if (follow){
      curUser.following.push(otherUserName);
      user.followers.push(name);
    } else{
      curUser.following.remove(otherUserName);
      user.followers.remove(name);
    }

    await curUser.save();
    await user.save();
    res.status(200).json({status: true, message: 'Followed/Unfollowed successfully'})
  } catch(err) {
    res.status(500).json({mssg: err})
  }
})

router.post("/login", async (req, res, next) => {
  try {
    const {name, password} = req.body;
    const user = await User.findOne({ name: name });
    if (!user) {
      res.send({ success: false, message: "User not registered." });
      throw createError.NotFound("User not registered");
    }
    const isMatch = await bcrypt.compare(password, user.password)
    
    if (!isMatch) {
      res.send({ success: false, message: "Username/password is not valid" });
      throw createError.Unauthorized("Incorrect Password");
    }

    const accessToken = await signAccessToken(req.body.name);
    setAccessToken(accessToken);
    res.cookie('token', accessToken)
    res.send({ success: true, message: accessToken });
    req.user = user;
  } catch (err) {
    console.log(err.message);
  }
});

module.exports = router;
