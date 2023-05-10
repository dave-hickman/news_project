const db = require("../db/connection");

exports.selectArticle = (articleID) => {
  return db
    .query(
      `SELECT * from articles
    WHERE article_id = $1;`,
      [articleID]
    )
    .then((article) => {
      if (article.rows.length === 0){
        return Promise.reject({status: 404, msg: `No user found for user_id: ${articleID}!`})
      }
      return article.rows;
    });
};
