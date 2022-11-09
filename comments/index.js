const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
const { randomBytes } = require("crypto");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentByPostId = {};

app.get("/posts/:id/comments", (req, res) => {
  res.send(commentByPostId[req.params.id] || []).status(200);
});

app.post("/posts/:id/comments", async (req, res) => {
  const commentId = randomBytes(4).toString("hex");
  const { comment } = req.body;
  const comments = commentByPostId[req.params.id] || [];
  comments.push({ id: commentId, comment });
  commentByPostId[req.params.id] = comments;

  await axios.post("http://localhost:4005/events", {
    // simple event-bus
    type: "CommentCreated",
    data: { id: commentId, comment, postId: req.params.id },
  });
  res.send(comments).status(201);
});

app.post("/events", (req, res) => {
  const { type } = req.body;
  console.log("Event Type: ", type);
  res.send({ event: type }).status(200);
});
app.listen(4001, () => {
  console.log("Listen on Port 4001");
});
