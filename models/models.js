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
        return Promise.reject({ message: "Invalid URL", status: 404 });
      } else {
        return res.rows[0];
      }
    });
};

exports.selectArticles = (sort_by, order, topic) => {
  let query = { sort_by, order, topic };

  let orderSQL = ``;
  let sortSQL = ``;
  let topicSQL = ``;

  let SQLQuery = `SELECT articles .*, CAST(COUNT(comments.article_id) AS INT) AS comment_count
      FROM articles
      LEFT JOIN comments
      ON articles.article_id = comments.article_id`;

  if (topic) {
    topicSQL = ` WHERE topic = '${topic}' `;
    SQLQuery = SQLQuery + topicSQL;
  }

  if (!sort_by) {
    sortSQL = `ORDER BY articles.created_at `;
  } else if (
    sort_by === "title" ||
    sort_by === "topic" ||
    sort_by === "author" ||
    sort_by === "body" ||
    sort_by === "created_at" ||
    sort_by === " article_img_url"
  ) {
    sortSQL = `ORDER BY articles.${sort_by} `;
  } else {
    sortSQL = `ORDER BY articles.created_at `;
  }

  if (!order) {
    orderSQL = `DESC`;
  } else if (order.toUpperCase() === "ASC" || order.toUpperCase() === "DESC") {
    orderSQL = `${order.toUpperCase()};`;
  }

  const groupSQL = ` GROUP BY articles.article_id `;

  const fullSQL = SQLQuery + groupSQL + sortSQL + orderSQL;

  return db.query(fullSQL).then((res) => {
    return res.rows;
  });
};

exports.selectComments = (article_id) => {
  return db
    .query(
      `SELECT *
    FROM comments
    WHERE article_id = $1
    ORDER BY created_at DESC`,
      [article_id]
    )

    .then((res) => {
      return res.rows;
    });
};

exports.writeComment = (newComment, article_id) => {
  const { username, body } = newComment;
  return db
    .query(
      `INSERT INTO comments (author, body, article_id)   VALUES ($1, $2, $3) 
      RETURNING *;`,
      [username, body, article_id]
    )
    .then((res) => {
      return res.rows[0];
    });
};

exports.updateVotes = (votes, article_id) => {
  return db
    .query(
      `UPDATE articles
      SET votes = votes + $1 
      WHERE article_id = $2
      RETURNING *;`,
      [votes.inc_votes, article_id]
    )
    .then((res) => {
      return res.rows[0];
    });
};

exports.removeComment = (comment_id) => {
  return db
    .query(
      `DELETE FROM comments 
       WHERE comment_id = $1 
       RETURNING *;`,
      [comment_id]
    )
    .then((res) => {
      return res.rows[0];
    });
};

exports.selectUsers = () => {
  return db.query(`SELECT * FROM users;`).then((res) => {
    return res.rows;
  });
};
