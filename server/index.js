const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors")
const corsOptions = require('./config/corsOptions');
const cookieParser = require('cookie-parser')
// const session = require('express-session')
const app = express();


app.use(cors(corsOptions));
require('dotenv').config();
app.use(cookieParser())
app.use(function(req, res, next) {
  res.header('Content-Type', 'application/json;charset=UTF-8')
  res.header('Access-Control-Allow-Credentials', true)
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  next()
})
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to DB");
  });

const UserRoute = require("./routes/User")
app.use("/user", UserRoute)

const JournalRoute = require("./routes/Journal")
app.use("/journal", JournalRoute)

const PostRoute = require("./routes/Post")
app.use("/post", PostRoute)

app.get('/test', (req, res) => {
  res.cookie('test', 123, { maxAge: 900000, httpOnly: true });
  res.send({mssg:'cookie set'})
})

app.post('/test-aage', (req, res) => {
  result = req.cookies;
  res.send({mssg: result})
  
})

app.use((req, res, next) => {
    const err = new Error("Not Found");
    err.status = 404;
    next(err);
})

app.listen(5000, () => {
    console.log("Server started on 5000")
})