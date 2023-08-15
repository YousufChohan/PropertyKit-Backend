const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");

//11
router.post("/userdata", (req, res) => {
  const { authorization } = req.headers;
  console.log(authorization);
  if (!authorization) {
    return res.status(400).json({ error: "Token not given!!" });
  }

  const token = authorization.replace("Bearer ", "");
  console.log(token);
  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: "Token invalid!!" });
    }
    const { _id } = payload;
    console.log(payload);

    User.findById(_id).then((userdata) => {
      console.log(userdata);
      res.status(200).send({ message: "User Found!!", user: userdata });
    });
  });
});

router.post("/changepassword", (req, res) => {
  const { oldpassword, newpassword, email } = req.body;

  if (!oldpassword || !newpassword || !email) {
    return res.status(400).json({ error: "Please fill all fields" });
  } else {
    User.findOne({ email: email }).then(async (savedUser) => {
      if (savedUser) {
        bcrypt.compare(oldpassword, savedUser.password).then((doMatch) => {
          if (doMatch) {
            savedUser.password = newpassword;
            savedUser
              .save()
              .then((user) => {
                res.json({ message: "Password Change Successfully!!" });
              })
              .catch((err) => {
                return res.status(400).json({ error: "Server Error" });
              });
          } else {
            return res.status(400).json({ error: "Invalid Credentials!!" });
          }
        });
      } else {
        return res.status(400).json({ error: "Invalid Credentials!!" });
      }
    });
  }
});

router.post("/changeusername", (req, res) => {
  const { username, email } = req.body;

  if (!username || !email) {
    return res.status(400).json({ error: "Please fill all fields" });
  }

  User.find({ username }).then(async (savedUser) => {
    if (savedUser.length > 0) {
      return res.status(400).json({ error: "Username Exists" });
    } else {
      User.findOne({ email: email }).then(async (savedUser) => {
        if (savedUser) {
          savedUser.username = username;
          savedUser
            .save()
            .then((user) => {
              res.json({ message: "Username Updated" });
            })
            .catch((err) => {
              return res.status(400).json({ error: "Server Error" });
            });
        } else {
          return res.status(400).json({ error: "Invalid Credentials!!" });
        }
      });
    }
  });
});

router.post("/setdescription", (req, res) => {
  const { description, email } = req.body;

  if (!description || !email) {
    return res.status(400).json({ error: "Please fill all fields" });
  }
  User.findOne({ email: email }).then(async (savedUser) => {
    if (savedUser) {
      savedUser.description = description;
      savedUser
        .save()
        .then((user) => {
          res.json({ message: "Description Updated" });
        })
        .catch((err) => {
          return res.status(400).json({ error: "Server Error" });
        });
    } else {
      return res.status(400).json({ error: "Invalid Credentials!!" });
    }
  });
});

router.post("/setagency", (req, res) => {
  const { agency, email } = req.body;

  if (!agency || !email) {
    return res.status(400).json({ error: "Please fill all fields" });
  }

  User.findOneAndUpdate(
    { email: email },
    { $set: { agency: agency } },
    { new: true }
  )
    .then((user) => {
      if (user) {
        res.json({ message: "A" });
      } else {
        return res.status(400).json({ error: "Invalid Credentials!!" });
      }
    })
    .catch((err) => {
      return res.status(400).json({ error: "Server Error" });
    });
});

router.post("/setmobile", (req, res) => {
  const { mobile, email } = req.body;

  if (!mobile || !email) {
    return res.status(400).json({ error: "Please fill all fields" });
  }

  User.findOneAndUpdate(
    { email: email },
    { $set: { mobile: mobile } },
    { new: true }
  )
    .then((user) => {
      if (user) {
        res.json({ message: "A" });
      } else {
        return res.status(400).json({ error: "Invalid Credentials!!" });
      }
    })
    .catch((err) => {
      return res.status(400).json({ error: "Server Error" });
    });
});

router.post("/setcity", (req, res) => {
  const { city, email } = req.body;

  if (!city || !email) {
    return res.status(400).json({ error: "Please fill all fields" });
  }

  User.findOneAndUpdate(
    { email: email },
    { $set: { city: city } },
    { new: true }
  )
    .then((user) => {
      if (user) {
        res.json({ message: "A" });
      } else {
        return res.status(400).json({ error: "Invalid Credentials!!" });
      }
    })
    .catch((err) => {
      return res.status(400).json({ error: "Server Error" });
    });
});

// router.post("/setagency", (req, res) => {
//   const { agency, email } = req.body;

//   if (!agency || !email) {
//     return res.status(400).json({ error: "Please fill all fields" });
//   }
//   User.findOne({ email: email }).then(async (savedUser) => {
//     if (savedUser) {
//       savedUser.agency = agency;
//       savedUser
//         .save()
//         .then((user) => {
//           res.json({ message: "Agency Updated" });
//         })
//         .catch((err) => {
//           return res.status(400).json({ error: "Server Error" });
//         });
//     } else {
//       return res.status(400).json({ error: "Invalid Credentials!!" });
//     }
//   });
// });

module.exports = router;
