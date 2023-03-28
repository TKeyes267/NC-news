const { selectTopics, selectArticleById } = require("../models/models");

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
      console.log({ article: article });
      res.status(200).send({ article: article });
    })
    .catch((err) => {
      next(err);
    });
};
