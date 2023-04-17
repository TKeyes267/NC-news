const cors = require("cors");
const express = require("express");
const app = express();

const {
  getTopics,
  getArticleById,
  getArticles,
  getCommentsById,
  postComment,
  patchVotes,
  deleteComment,
  getUsers,
  getEndpoints,
} = require("./controllers/controller");

const {
  customErrors,
  errorsPSQL,
  errors404,
  errorsServer,
} = require("./errorhandling.js");

app.use(cors());

app.use(express.json());

//Endpoints

app.get("/api", getEndpoints);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getCommentsById);

app.post("/api/articles/:article_id/comments", postComment);

app.patch("/api/articles/:article_id", patchVotes);

app.delete("/api/comments/:comment_id", deleteComment);

app.get("/api/users", getUsers);

//Error handling

app.use(customErrors);
app.use(errors404);
app.use(errorsPSQL);
app.use(errorsServer);

module.exports = app;
