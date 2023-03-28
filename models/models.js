const db = require("../db/connection.js");

exports.selectTopics = () => {
  return db.query(`SELECT * FROM topics;`).then((res) => {
    return res.rows;
  });
};

exports.selectArticleById = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id= $1`, [article_id])
    .then((res) => {
      if (res.rows.length === 0) {
        return Promise.reject({ message: "ID not found", status: 404 });
      } else {
        return res.rows[0];
      }
    });
};
