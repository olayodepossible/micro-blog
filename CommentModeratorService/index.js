const express = require("express");
const bodyParser = require("body-parser");
const Axios = require("axios");

const app = express();
app.use(bodyParser.json());

app.post("/events", async (req, res) => {
  const { type, data } = req.body;
  console.log("data", data);
  if (type === "CommentCreated") {
    data.status = data.content.toLowerCase().includes("orange") ? "rejected" : "approved";
    try {
      await Axios.post("http://localhost:4005/events", {
        // send to event-bus
        type: "CommentModerated",
        data,
      });
    } catch (error) {
      console.error(error);
    }
  }
  res.send({ commentStatus: data.status }).status(201);
});

app.listen(4003, () => console.log("Listening on port 4003"));
