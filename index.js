const express = require("express");
const bodyParser = require("body-parser");
const port = 3000;
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();

require("./models/User");
require('./models/Message');

const authRoutes = require("./routes/authRoutes");
const uploadMedia = require("./routes/uploadMedia");
const profile = require("./routes/profile");
const search = require("./routes/search");
const message = require('./routes/message');

mongoose.set("strictQuery", false);

const { createServer } = require("http");
const { Server } = require("socket.io");

const httpServer = createServer();


const io = new Server(httpServer, {});

app.use(bodyParser.json());
app.use(authRoutes);
app.use(uploadMedia);
app.use(profile);
app.use(search);
app.use(message);

app.get("/", (req, res) => {
  res.send("hello World");
});


io.on("connection", (socket) => {

  console.log("USER CONNECTED - ", socket.id);

  socket.on("disconnect", () => {
      console.log("USER DISCONNECTED - ", socket.id);
  });

  socket.on("join_room", (data) => {
      console.log("USER WITH ID - ",socket.id,"JOIN ROOM - ", data.roomid);
      socket.join(data);
  });

  socket.on("send_message", (data) => {
      console.log("MESSAGE RECEIVED - ", data);
      io.emit("receive_message", data);
  });
});

httpServer.listen(3001);

app.listen(port, () => {
  console.log("Server is running on port" + port);
});

mongoose
  .connect(process.env.mongo_URL)
  .then(() => {
    console.log("Connected to database");
  })
  .catch((err) => {
    console.log("Error connectiong to database" + err);
  });
