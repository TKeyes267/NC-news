const express = require("express");
const app = express();

const {
  getTopics,
  getArticleById,
  getArticles,
  getCommentsById,
} = require("./controllers/controller");

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getCommentsById);

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
