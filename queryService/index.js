const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.get("/posts", (req, res) => {
  res.send(posts).status(200);
});

app.post("/events", (req, res) => {
  const { type, data } = req.body;
  if (type === "PostCreated") {
    const { id, title } = data;
    posts[id] = { id, title, comments: [] };
  }
  if (type === "CommentCreated") {
    const { id, comment, postId } = data;
    posts[postId].comments.push({ id, comment });
  }
  console.log(`Data for ${type} - event recieved!`);
  res.send({ Event: type }).status(200);
});

app.listen(4002, () => {
  console.log("Listening on port 4002");
});
