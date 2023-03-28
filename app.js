const express = require("express");
const app = express();

const { getTopics, getArticleById } = require("./controllers/controller");

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ message: "Invalid ID" });
  } else if (err.status === 404) {
    res.status(404).send({ message: err.message });
  } else if (err.status === 500) {
    res.status(500).send("Internal Server Error!");
  }
});

module.exports = app;
