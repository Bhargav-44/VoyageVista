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
    cb(null, "../client/public/journal");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({ storage: storage, limits: { fieldSize: 2 * 1024 * 1024 } });


router.post("/update", upload.single("picture"), async(req, res, next) =>  {
  try {
    const {id, content, title} = req.body;
    const picture = req.file.filename;
    const accessToken = req.cookies.token;
    const name = await getNamefromToken(accessToken);
    
    const updateData = {
      $set: {
        "journals.$[elem].picture": picture,
        "journals.$[elem].content": content,
        "journals.$[elem].title": title
      }
    };
    
    const options = {
      arrayFilters: [{ "elem.id": id }],
      new: true
    };

    const updatedUser = await User.findOneAndUpdate(
      { name: name },
      updateData,
      options
    );

    if (!updatedUser) {
      return res.status(404).json({ mssg: "User not found" });
    }

    res.status(200).json({ status: true, mssg: "Content updated successfully" });

  } catch(err) {
    console.error(err);
    res.status(500).json({ mssg: "Something went wrong" });
  }
});


router.post("/", async(req, res, next) => {
  try{
    const {id} = req.body;
    const accessToken = req.cookies.token;
    
    const user = await User.findOne({"journals.id" : id});
    if (!user) {
      return res.status(404).json({ mssg: "User not found" });
    }
    const journal = user.journals.filter((el) => el.id === id);
    if (journal.length === 0) {
      return res.status(404).json({ mssg: "Journal not found" });
    }
    console.log(user.picture)
    res.status(200).json({ status: true, journal: journal, name: user.name , img: user.picture});
  } catch(err) {
    res.status(501).json({mssg: "Something went wrong"})
  }
})


router.post("/upvote", async (req, res, next) => {
  try {
    const { id } = req.body;
    console.log(id);
    const accessToken = req.cookies.token;
    if (!accessToken) {
      return res.status(401).json({ mssg: "Login first" });
    }
    const name = await getNamefromToken(accessToken);
    const user = await User.findOne({ "journals.id": id });
    if (!user) {
      return res.status(404).json({ status: false, mssg: "Journal not found" });
    }
    const journal = user.journals.find((el) => el.id === id);
    if (!journal) {
      return res.status(404).json({ status: false, mssg: "Journal not found" });
    }
    if (!journal.upvote) {
      journal.upvote = [];
    }
    if (!journal.upvote.includes(name)) {
      journal.upvote.push(name);
      await user.save();
      res.status(200).json({ status: true, mssg: 'Upvoted successfully' });
    } else {
      res.status(400).json({ status: false, mssg: 'Already upvoted' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, mssg: "Internal server error" });
  }
});

router.post("/downvote", async (req, res, next) => {
  try {
    const { id } = req.body;
    console.log(id);
    const accessToken = req.cookies.token;
    if (!accessToken) {
      return res.status(401).json({ mssg: "Login first" });
    }
    const name = await getNamefromToken(accessToken);
    const user = await User.findOne({ "journals.id": id });
    if (!user) {
      return res.status(404).json({ status: false, mssg: "Journal not found" });
    }
    const journal = user.journals.find((el) => el.id === id);
    if (!journal) {
      return res.status(404).json({ status: false, mssg: "Journal not found" });
    }
    if (!journal.downvote) {
      journal.downvote = [];
    }
    if (!journal.downvote.includes(name)) {
      journal.downvote.push(name);
      await user.save();
      res.status(200).json({ status: true, mssg: 'Downvoted successfully' });
    } else {
      res.status(400).json({ status: false, mssg: 'Already downvoted' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, mssg: "Internal server error" });
  }
});


router.post("/bookmark", async(req, res, next) => {
  try{
    const {id} = req.body;
    const accessToken = req.cookies.token;
    if (!accessToken) res.status(404).json({ mssg: "Login first" });
    const name = await getNamefromToken(accessToken);
    const user = await User.findOne({name});
    const otherUser = await User.findOne({"journals.id" : id});
    const journal = otherUser.journals.find((el) => el.id === id);
    user.list.push(journal);
    await user.save();
    res.status(200).json({status: true, mssg: "Journal Saved"})
  } catch(err) {
    res.status(500).json({status: false, mssg: err})
  }
})

router.post("/comment", async(req, res, next) => {
  try{
    const {id, comment} = req.body;
    console.log(id)
    const accessToken = req.cookies.token;
    if (!accessToken) res.status(404).json({ mssg: "Login first" });
    const name = await getNamefromToken(accessToken);
    const user = await User.findOne({'journals.id':id})
    const currUser = await User.findOne({name});
    const journal = user.journals.find((obj) => obj.id === id);
    const updatedData = {
       name : name,
      comment : comment,
      img : currUser.picture
    }

    journal.comment.push(updatedData);
    console.log(journal)
    await user.save();
    res.status(200).json({status: true, mssg: "Comment Added"})

    

  } catch(err) {
    res.status(501).json({mssg: "Something went wrong"})
  }
})


router.post("/delete", async(req, res, next) => {
  try{
    const {id} = req.body;
    const accessToken = req.cookies.token;
    const name = await getNamefromToken(accessToken);
    const user = await User.findOne({name});
    const journal = user.journals.find((obj) => obj.id === id);
    user.journals.remove(journal)
    await user.save();
    res.status(200).json({status: true, mssg: "Journal Deleted"})
  } catch(err) {
    res.status(501).json({mssg: "Something went wrong"})
  }
})

router.post("/save", upload.single("picture"), async(req, res, next) =>  {
  try{
    const {id,content, title} = req.body;
    const picture = req.file.filename;
    const accessToken=  req.cookies.token;
    const name = await getNamefromToken(accessToken);
    const user = await User.findOne({name});
    if (!user) {
      return res.status(404).json({ mssg: "User not found" });
    }
    const updateData = {
      id: id,
      picture: picture,
      content: content,
      title: title,
    
    };
    user.journals.push(updateData);
    await user.save();
    res.status(200).json({status: true,  mssg: "Content saved successfully" });

  } catch(err) {
    res.status(501).json({mssg: "Something went wrong"})
  }
})

module.exports = router;

