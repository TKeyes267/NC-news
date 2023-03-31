const format = require("pg-format");
const db = require("../../db/connection.js");

exports.convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};

exports.createRef = (arr, key, value) => {
  return arr.reduce((ref, element) => {
    ref[element[key]] = element[value];
    return ref;
  }, {});
};

exports.formatComments = (comments, idLookup) => {
  return comments.map(({ created_by, belongs_to, ...restOfComment }) => {
    const article_id = idLookup[belongs_to];
    return {
      article_id,
      author: created_by,
      ...this.convertTimestampToDate(restOfComment),
    };
  });
};

exports.checkArticleIdExists = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then((res) => {
      if (res.rows.length === 0) {
        return Promise.reject({ status: 404, message: "ID does not exist" });
      }
    });
};

exports.checkComment = (newComment) => {
  const user = newComment.username;
  if (Object.keys(newComment).length > 2) {
    return Promise.reject({
      status: 400,
      message: "Invalid Request: Please only add username and body properties",
    });
  } else {
    return db
      .query(`SELECT * FROM users WHERE users.username = $1`, [user])
      .then((res) => {
        if (res.rows.length === 0) {
          return Promise.reject({
            status: 404,
            message: "User does not exist",
          });
        }
      });
  }
};

exports.checkVotes = (votes, article_id) => {
  if (Object.keys(votes).length > 1) {
    return Promise.reject({
      status: 400,
      message: "Invalid Request: Please only add username and body properties",
    });
  } else {
    return db
      .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
      .then((res) => {
        if (res.rows.length === 0) {
          return Promise.reject({ status: 404, message: "ID does not exist" });
        }
      });
  }
};
