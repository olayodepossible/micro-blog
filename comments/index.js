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
  const { content } = req.body;
  const comments = commentByPostId[req.params.id] || [];
  comments.push({ id: commentId, content, status: "pending" });
  commentByPostId[req.params.id] = comments;

  try {
    await axios.post("http://localhost:4005/events", {
      // simple event-bus
      type: "CommentCreated",
      data: { id: commentId, content, postId: req.params.id, status: "pending" },
    });
  } catch (error) {
    console.error(error);
  }
  res.send(comments).status(201);
});

app.post("/events", async (req, res) => {
  const { type, data } = req.body;
  console.log("Event Type: ", type);
  if (type === "CommentModerated") {
    const { id, postId, status } = data;

    const comment = commentByPostId[postId].find((item) => {
      return item.id === id;
    });
    comment.status = status;

    try {
      await axios.post("http://localhost:4005/events", {
        // send to event-bus

        type: "CommentUpdated",
        data: { ...comment, postId },
      });
    } catch (error) {
      console.log(error);
    }
  }

  res.send({ event: type }).status(200);
});
app.listen(4001, () => {
  console.log("Listen on Port 4001");
});
