const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");

async function mailer(email, code) {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    requireTLS: true,
    auth: {
      user: process.env.NodeMailer_email, // generated ethereal user
      pass: process.env.NodeMailer_password, // generated ethereal password
    },
  });

  let info = await transporter.sendMail({
    from: "FYP",
    to: `${email}`,
    subject: "Email Verification",
    text: `Your Verification Code is ${code}`,
    html: `<b>Your Verification Code is ${code}</b>`,
  });

  console.log("Message sent: %s", info.messageId);
  console.log("code: %s", code);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

router.post("/verify", (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Please fill all fields" });
  }
  User.findOne({ email: email }).then(async (savedUser) => {
    if (savedUser) {
      return res.status(400).json({ error: "User already exsist!!" });
    }
    try {
      let VerificationCode = Math.floor(100000 + Math.random() * 900000);
      await mailer(email, VerificationCode);
      res.send({ message: "Email Sent", VerificationCode, email });
    } catch (err) {
      return res.status(400).json({ error: "Error sending email" });
    }
  });
});

router.post("/setusername", (req, res) => {
  const { username, email } = req.body;
  console.log(req.body);
  User.find({ username }).then(async (savedUser) => {
    console.log(savedUser);
    if (savedUser.length > 0) {
      return res.status(400).json({ error: "Username Exists" });
    } else {
      return res
        .status(200)
        .json({ message: "Username Available", username, email });
    }
  });
});

router.post("/signup", async (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    return res.status(400).json({ error: "Please fill all fields" });
  } else {
    const user = new User({
      username,
      password,
      email,
    });
    try {
      await user.save();
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
      return res.status(200).json({ message: "User Registered!!", token });
    } catch (err) {
      return res.status(400).json({ error: "User Not Registered!!" });
    }
  }
});

router.post("/forgotpass", (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Please fill all fields" });
  }
  User.findOne({ email: email }).then(async (savedUser) => {
    if (savedUser) {
      try {
        let VerificationCode = Math.floor(100000 + Math.random() * 900000);
        await mailer(email, VerificationCode);
        res.send({ message: "Email Sent", VerificationCode, email });
      } catch (err) {
        return res.status(400).json({ error: "Error sending email" });
      }
    } else {
      return res.status(400).json({ error: "Invalid Credentials!!" });
    }
  });
});

router.post("/resetpass", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Please fill all fields" });
  } else {
    User.findOne({ email: email }).then(async (savedUser) => {
      if (savedUser) {
        savedUser.password = password;
        savedUser
          .save()
          .then((user) => {
            res.json({ message: "Password Change" });
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        return res.status(400).json({ error: "Invalid Credentials!!" });
      }
    });
  }
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Please fill all fields" });
  } else {
    User.findOne({ email: email })
      .then((savedUser) => {
        if (!savedUser) {
          return res.status(400).json({ error: "Invalid Credentials!!" });
        } else {
          bcrypt.compare(password, savedUser.password).then((doMatch) => {
            if (doMatch) {
              const token = jwt.sign(
                { _id: savedUser._id },
                process.env.JWT_SECRET
              );

              const { _id, username, email } = savedUser;
              res.json({
                message: "Successfully Signed In!!",
                token,
                user: { _id, username, email },
              });
            } else {
              return res.status(400).json({ error: "Invalid Credentials!!" });
            }
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
});

module.exports = router;
