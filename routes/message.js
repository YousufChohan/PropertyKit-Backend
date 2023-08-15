const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const Message = mongoose.model("Message");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");

router.post("/savemessage", async (req, res) => {
  const { senderid, message, roomid, recieverid } = req.body;
  console.log("MESSAGE RECEIVED - ", req.body);
  try {
    const newMessage = new Message({
      senderid,
      message,
      roomid,
      recieverid,
    });
    await newMessage.save();
    res.send({ message: "Message saved successfully" });
  } catch (err) {
    res.status(422).send(err.message);
  }
});

router.post("/getmessages", async (req, res) => {
  const { roomid } = req.body;
  Message.find({ roomid: roomid })
    .then((messages) => {
      console.log(messages);
      res.status(200).send(messages);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send(err);
    });
});

router.post("/setusermessages", async (req, res) => {
  const { ouruserid, fuserid, lastmessage, roomid } = req.body;
  User.findOne({ _id: ouruserid })
    .then((user) => {
      user.allmessages.map((item) => {
        if (item.fuserid == fuserid) {
          user.allmessages.pull(item);
        }
      });
      const date = Date.now();
      user.allmessages.push({ ouruserid, fuserid, lastmessage, roomid, date });
      user.save();
      res.status(200).send({ message: "Message saved successfully" });
    })
    .catch((err) => {
      console.log(err);
      res.status(422).send(err.message);
    });
});

router.post("/getusermessages", async (req, res) => {
  const { userid } = req.body;

  User.findOne({ _id: userid })
    .then((user) => {
      console.log(user);
      res.status(200).send(user.allmessages);
    })
    .catch((err) => {
      console.log(err);
      res.status(422).send(err.message);
    });
});

module.exports = router;
