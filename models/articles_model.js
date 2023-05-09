const db = require('../db/connection')

exports.selectArticles = () => {
    return db.query(`SELECT * from articles`)
    .then((articles) =>
    {return articles.rows})
}