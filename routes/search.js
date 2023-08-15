const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");

router.get("/msguser", (req, res) => {
  User.find({})
    .then((user) => {
      let data = [];
      user.map((item) => {
        data.push({
          _id: item._id,
          username: item.username,
          email: item.email,
          profilepic: item.profilepic,
        });
      });

      // console.log(data);
      if (data.length == 0) {
        return res.status(422).json({ error: "No User Found" });
      }
      res.status(200).send({ message: "User Found", user: data });
    })
    .catch((err) => {
      res.status(422).json({ error: "Server Error" });
    });
});
router.post("/searchUser", (req, res) => {
  const { keyword } = req.body;
  User.find({})
    .then((user) => {
      let data = [];
      user.map((item) => {
        var posts = item.posts.map((el) => el);
        posts = posts.map((el) => {
          return { ...item._doc, ...el };
        });
        console.log(posts);
        data.push({
          _id: item._id,
          // username: item.username,
          // email: item.email,
          // description: item.description,
          // profilepic: item.profilepic,
          posts,
        });
      });
      if (data.length == 0) {
        return res.status(400).json({ error: "No User Found" });
      }

      res.status(200).send({
        user: data,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({ error: "Server Error" });
    });
});
router.post("/searchDemand", (req, res) => {
  const { keyword } = req.body;
  User.find({})
    .then((users) => {
      let data = [];
      users.map((user) => {
        var demands = user.demands.map((demand) => demand);
        demands = demands.map((demand) => {
          return { ...user._doc, ...demand };
        });
        console.log(demands);
        data.push({
          _id: user._id,
          demands,
        });
      });
      if (data.length == 0) {
        return res.status(400).json({ error: "No Demand Found" });
      }

      res.status(200).send({
        demands: data,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({ error: "Server Error" });
    });
});

router.post("/allUsers", (req, res) => {
  User.find({})
    .then((user) => {
      let data = [];
      user.map((item) => {
        var posts = item.posts.map((el) => el);
        posts = posts.map((el) => {
          return { ...item._doc, ...el };
        });
        console.log(posts);
        data.push({
          _id: item._id,
          posts,
        });
      });
      if (data.length == 0) {
        return res.status(400).json({ error: "No User Found" });
      }

      res.status(200).send({
        user: data,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({ error: "Server Error" });
    });
});

router.post("/otheruserdata", (req, res) => {
  const { email } = req.body;

  User.findOne({ email: email }).then((savedUser) => {
    if (!savedUser) {
      return res.status(400).json({ error: "Invalid Credentials!!" });
    }
    // let data = {
    //   _id: savedUser._id,
    //   username: savedUser.username,
    //   email: savedUser.email,
    //   description: savedUser.description,
    //   profilepic: savedUser.profilepic,
    //   followers: savedUser.followers,
    //   following: savedUser.following,
    //   posts: savedUser.posts,
    // };

    res.status(200).send({ message: "User Found!!", user: savedUser });
  });
});

module.exports = router;
