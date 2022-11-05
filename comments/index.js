const express = require("express");
const bodyParser = require("bodyParser");
const cors = require("cors");
const { randomByte } = require("randomByte");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentByPostId = {};

app.get("/posts/:id/comments", (req, res) => {
  res.send(commentByPostId[req.params.id] || []).status(200);
});

app.post("/post/:id/commnets", (req, res) => {
  const commentId = randomByte(4).toString("hex");
  const { comment } = req.body;
  const comments = commentByPostId[req.params.id] || [];
  comments.push({ id: commentId, comment });
  commentByPostId[req.params.id] = comments;

  res.send(comments).status(201);
});

app.listen(4001, () => {
  console.log("Listen on Port 4001");
});
