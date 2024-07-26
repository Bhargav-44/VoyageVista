const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const commentSchema = new mongoose.Schema({
  name: String,
  comment: String,
  // createdAt: { type: Date, default: Date.now },
  img: String,
});

const tagSchema = new mongoose.Schema({
  x: Number,
  y: Number,
  name: String,
});

const postSchema = new mongoose.Schema({
  id: String,
  picture: String,
  caption: String,
  comments: [commentSchema],
  likes: [String],
  tags: [tagSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const journalSchema = new mongoose.Schema({
  id: String,
  picture: String,
  content: String,
  title: String,
  upvote: { type: [String], default: [] },
  downvote: { type: [String], default: [] },
  comment: [commentSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const realTagSchema = new mongoose.Schema({
  id: String,
  taggedBy: String
})

const UserSchema = new Schema({
  name: String,
  email: String,
  password: String,
  picture: String,
  bio: String,
  pronouns: String,
  destination: [String],
  style: String,
  budget: String,
  followers: {
    type: [String],
    default: [],
  },
  following: {
    type: [String],
    default: [],
  },
  posts: [postSchema],
  journals: { 
    type: [journalSchema], 
    default: [] 
  },
  list: [journalSchema],
  tags: {
    type: [realTagSchema],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// UserSchema.pre("save", async function (next) {
//   try {
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(this.password, salt);
//     this.password = hashedPassword;
//     next();
//   } catch (error) {
//     next(error);
//   }
// });

// UserSchema.methods.isValidPassword = async function (password) {
//   try {
//     return await bcrypt.compare(password, this.password);
//   } catch (error) {
//     throw error;
//   }
// };

UserSchema.methods.getNameFromToken = async function (accessToken) {
  try {
    const decoded = jwt.decode(accessToken);
    const name = decoded.aud;
    return name;
  } catch (error) {
    console.error("Error decoding the token:", error);
    return null;
  }
};

const User = mongoose.model("user", UserSchema);

module.exports = User;
