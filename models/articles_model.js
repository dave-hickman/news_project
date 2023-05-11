const db = require("../db/connection");
const { checkExists } = require("../db/seeds/utils");

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

exports.selectAllArticles = () => {
  return db.query(`SELECT author, title, article_id, topic, created_at, votes, article_img_url, (SELECT COUNT(article_id) 
  FROM comments WHERE comments.article_id = articles.article_id) AS comment_count FROM articles
  ORDER BY created_at DESC;`)
  .then((article) => {
    return article.rows
  })
}
exports.selectComments = (articleID) => {
  return Promise.all([db.query(
    `SELECT * from comments
    WHERE article_id = $1
    ORDER BY created_at DESC;`, [articleID]),
    checkExists('articles', 'article_id', articleID)]
  )
  .then(([comments, checkExistsOutput]) => {
      return comments.rows})
}

exports.editArticle = (articleID, voteBody) => {
  const voteAddition = voteBody.inc_votes 
 return db.query(`UPDATE articles
  SET votes = votes + $1 WHERE article_id = $2 RETURNING *`, [voteAddition, articleID])
  .then((article) => {
    return article.rows
  })

}