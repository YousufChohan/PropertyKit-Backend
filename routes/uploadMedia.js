const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");

//13
router.post("/setprofilepic", (req, res) => {
  const { email, profilepic } = req.body;

  User.findOne({ email: email })
    .then(async (savedUser) => {
      if (!savedUser) {
        return res.status(400).json({ error: "Invalid Credentials!!" });
      }
      savedUser.profilepic = profilepic;
      savedUser
        .save()
        .then((user) => {
          res.json({ message: "Profile Picture Upload!!" });
        })
        .catch((err) => {
          // return res.status(400).json({ error: "Server Error" });
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
});

//14
router.post("/addproperty", (req, res) => {
  const {
    email,
    post,
    propertydetail,
    propertyprecinct,
    propertystreet,
    propertyprice,
    propertynum,
    propertytype,
  } = req.body;

  User.findOne({ email: email })
    .then(async (savedUser) => {
      if (!savedUser) {
        return res.status(400).json({ error: "Invalid Credentials!!" });
      }
      savedUser.posts.push({
        post,
        propertydetail,
        propertyprecinct,
        propertystreet,
        propertyprice,
        propertynum,
        propertytype,
        likes: [],
        comments: [],
      });
      savedUser
        .save()
        .then((user) => {
          res.json({ message: "Post Added!!" });
        })
        .catch((err) => {
          return res.status(400).json({ error: "Error Adding Post!!" });
        });
    })
    .catch((err) => {
      console.log(err);
    });
});

///////////add demand

router.post("/adddemand", (req, res) => {
  const {
    email,
    demanddetail,
    demandprecinct,
    demandstreet,
    demandprice,
    demandnum,
    demandtype,
  } = req.body;

  User.findOne({ email: email })
    .then(async (savedUser) => {
      if (!savedUser) {
        return res.status(400).json({ error: "Invalid Credentials!!" });
      }

      const newDemand = {
        demanddetail,
        demandprecinct,
        demandstreet,
        demandprice,
        demandnum,
        demandtype,
        likes: [],
        comments: [],
      };

      savedUser.demands.push(newDemand);

      savedUser
        .save()
        .then((user) => {
          res.json({ message: "Demand Added!!", demand: newDemand });
        })
        .catch((err) => {
          return res.status(400).json({ error: "Error Adding Demand!!" });
        });
    })
    .catch((err) => {
      console.log(err);
    });
});

// router.post("/adddemand", (req, res) => {
//   const {
//     email,
//     demanddetail,
//     demandprecinct,
//     demandstreet,
//     demandprice,
//     demandnum,
//     demandtype,
//   } = req.body;

//   User.findOne({ email: email })
//     .then(async (savedUser) => {
//       if (!savedUser) {
//         return res.status(400).json({ error: "Invalid Credentials!!" });
//       }
//       savedUser.demands.push({
//         demanddetail,
//         demandprecinct,
//         demandstreet,
//         demandprice,
//         demandnum,
//         demandtype,
//         likes: [],
//         comments: [],
//       });
//       savedUser
//         .save()
//         .then((user) => {
//           res.json({ message: "Demand Added!!" });
//         })
//         .catch((err) => {
//           return res.status(400).json({ error: "Error Adding Demand!!" });
//         });
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// });

module.exports = router;
