const http = require("http");
const express = require("express");
const cors = require("cors");
const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:8080",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

app.use(cors());

io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("message", (response) => {
    console.log("Message received: ", response);
    io.emit("message", response);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(3005, () => {
  console.log("Server started on port 3005");
});
