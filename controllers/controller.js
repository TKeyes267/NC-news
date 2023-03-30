const { checkArticleIdExists, checkComment } = require("../db/seeds/utils.js");

const {
  selectTopics,
  selectArticleById,
  selectArticles,
  selectComments,
  writeComment,
} = require("../models/models");

exports.getTopics = (req, res, next) => {
  selectTopics()
    .then((topics) => {
      res.status(200).send({ topics: topics });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article: article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticles = (req, res, next) => {
  selectArticles()
    .then((articles) => {
      res.status(200).send({ articles: articles });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getCommentsById = (req, res, next) => {
  const { article_id } = req.params;
  const select = selectComments(article_id);
  const checkArticle = checkArticleIdExists(article_id);
  return Promise.all([select, checkArticle])

    .then(([comments]) => {
      res.status(200).send({ comments: comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postComment = (req, res, next) => {
  const { article_id } = req.params;
  const newComment = req.body;

  const checkArticle = checkArticleIdExists(article_id);
  const write = writeComment(newComment, article_id);
  const checkComments = checkComment(newComment);

  return Promise.all([write, checkComments, checkArticle])

    .then(([comment]) => {
      res.status(201).send({ comment: comment });
    })
    .catch((err) => {
      next(err);
    });
};
