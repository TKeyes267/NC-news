const {
  checkArticleIdExists,
  checkComment,
  checkVotesAndId,
  checkCommentExists,
  checkSortByQuery,
  checkOrderQuery,
  checkTopicQuery,
} = require("../db/seeds/utils.js");

const {
  selectTopics,
  selectArticleById,
  selectArticles,
  selectComments,
  writeComment,
  updateVotes,
  removeComment,
  selectUsers,
  readEndPoints,
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
  const { sort_by, order, topic } = req.query;

  selectArticles(sort_by, order, topic);

  const select = selectArticles(sort_by, order, topic);
  const checkSort = checkSortByQuery(sort_by);
  const checkOrder = checkOrderQuery(order);
  const checkTopic = checkTopicQuery(topic);

  return Promise.all([select, checkSort, checkOrder, checkTopic])

    .then(([articles]) => {
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

exports.patchVotes = (req, res, next) => {
  const { article_id } = req.params;
  const votes = req.body;

  const update = updateVotes(votes, article_id);
  const voteCheck = checkVotesAndId(votes, article_id);

  return Promise.all([update, voteCheck])

    .then(([updateArticle]) => {
      res.status(200).send(updateArticle);
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;

  const check = checkCommentExists(comment_id);
  const remove = removeComment(comment_id);

  return Promise.all([remove, check])

    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};

exports.getUsers = (req, res, next) => {
  selectUsers()
    .then((users) => {
      res.status(200).send({ users: users });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getEndpoints = (req, res, next) => {
  readEndPoints()
    .then((allEndPoints) => {
      res.status(200).send({ allEndPoints });
    })
    .catch((err) => {
      next(err);
    });
};
