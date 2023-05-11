const db = require("../db/connection");

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
          msg: `No user found for user_id: ${articleID}!`,
        });
      }
      return article.rows;
    });
};

exports.selectAllArticles = () => {
  return db
    .query(
      `SELECT author, title, article_id, topic, created_at, votes, article_img_url, (SELECT COUNT(article_id) 
  FROM comments WHERE comments.article_id = articles.article_id) AS comment_count FROM articles
  ORDER BY created_at DESC;`
    )
    .then((article) => {
      return article.rows;
    });
};

exports.sendComment = (articleID, commentInfo) => {
  const { username } = commentInfo;
  const { body } = commentInfo;
  return db
    .query(
      `INSERT INTO comments (username, body, article_id)
  VALUES ($1, $2, $3) RETURNING *`,
      [username, body, articleID]
    )
    .then((comment) => {
      return comment.rows;
    });
};
