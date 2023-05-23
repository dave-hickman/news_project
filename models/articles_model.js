const db = require("../db/connection");
const { checkExists } = require("../db/seeds/utils");
const format = require("pg-format");

exports.selectArticle = (articleID) => {
  return db
    .query(
      `SELECT * from articles
    WHERE article_id = $1;`,
      [articleID]
    )
    .then((article) => {
      if (article.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `No article found for article_id: ${articleID}!`,
        });
      }
      return article.rows;
    });
};

exports.selectAllArticles = (topic = null, sortBy = "created_at", order = "desc") => {
  let query = `SELECT author, title, article_id, topic, created_at, votes, article_img_url, 
    (SELECT COUNT(article_id) FROM comments WHERE comments.article_id = articles.article_id) AS comment_count 
    FROM articles`;

  const params = [];

  if (topic !== null) {
    params.push(topic);
    query += ` WHERE topic = $1`;
  }
  
  if (order === 'asc' || order === 'desc'){
  const orderByClause = ` ORDER BY ${format("%I", sortBy)} ${order.toUpperCase()}`;
  query += orderByClause;}
  else {query += `ORDER BY ${format("%I", sortBy)} DESC`}

  return db.query(query, params)
    .then((article) => {
      if (article.rows.length === 0) {
        throw {
          status: 404,
          msg: `No articles found for topic: ${topic}!`,
        };
      }
      return article.rows;
    });
};

exports.selectComments = (articleID) => {
  return Promise.all([
    db.query(
      `SELECT * from comments
    WHERE article_id = $1
    ORDER BY created_at DESC;`,
      [articleID]
    ),
    checkExists("articles", "article_id", articleID),
  ]).then(([comments, checkExistsOutput]) => {
    return comments.rows;
  });
};

exports.selectUsers = () => {
  return db
    .query(`SELECT username, name, avatar_url FROM users`)
    .then((users) => {
      return users.rows;
    });
};

exports.sendComment = (articleID, commentInfo) => {
  if (!commentInfo.body || !commentInfo.username) {
    return Promise.reject({
      status: 400,
      msg: "Missing inputs!",
    });
  }

  const { username } = commentInfo;
  const { body } = commentInfo;
  const values = [[username, body, articleID]];
  const formattedInsert = format(
    `INSERT INTO comments (author, body, article_id)
  VALUES %L RETURNING *;`,
    values
  );
  return db.query(formattedInsert).then((comment) => {
    return comment.rows;
  });
};

exports.editArticle = (articleID, voteBody) => {
  if (!voteBody.inc_votes) {
    return Promise.reject({
      status: 400,
      msg: "Missing inputs!",
    });
  }
  const voteAddition = voteBody.inc_votes;
  return db
    .query(
      `UPDATE articles
  SET votes = votes + $1 WHERE article_id = $2 RETURNING *`,
      [voteAddition, articleID]
    )
    .then((article) => {
      if (article.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `No article found for article_id: ${articleID}!`,
        });
      }
      return article.rows;
    });
};

exports.removeComment = (commentID) => {
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *`, [
      commentID,
    ])
    .then((comment) => {
      if (comment.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `No comment found for comment_id: ${commentID}!`,
        });
      }
    });
};
