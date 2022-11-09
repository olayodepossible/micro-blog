const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
const { randomBytes } = require("crypto");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {}; // serve as InMemoryDB

app.get("/post", (req, res) => {
  res.send(posts).status(200);
});

app.post("/post", async (req, res) => {
  const id = randomBytes(4).toString("hex");
  const { title } = req.body;
  posts[id] = {
    id,
    title,
  };

  await axios.post("http://localhost:4005/events", {
    // simple event-bus
    type: "PostCreated",
    data: { id, title },
  });
  res.status(201).send(posts[id]);
});

app.post("/events", (req, res) => {
  const { type } = req.body;
  console.log("Event Type: ", type);
  res.send({ event: type }).status(200);
});

app.listen(4000, () => {
  console.log("Listening on port 4000");
});
