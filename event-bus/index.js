const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

app.post("/events", async (req, res) => {
  const event = req.body;

  try {
    switch (event.type) {
      case "PostCreated":
        await axios.post("http://localhost:4002/events", event);
        break;
      case "CommentCreated":
        await axios.post("http://localhost:4002/events", event);
        await axios.post("http://localhost:4003/events", event);
        break;
      case "CommentModerated":
        await axios.post("http://localhost:4001/events", event);
        break;
      case "CommentUpdated":
        await axios.post("http://localhost:4002/events", event);
        break;

      default:
        break;
    }
  } catch (error) {
    console.error(error);
  }

  res.send({ status: "OK" }).status(200);
});

app.listen(4005, () => {
  console.log("Listening on port 4005");
});
