const {selectArticle, selectComments, selectAllArticles} = require('../models/articles_model')

exports.getArticle = (req,res,next) => {
    const articleID = req.params.article_id
    selectArticle(articleID)
    .then((article) => {
        res.status(200).send({article})
    })
    .catch(next)
}

exports.getAllArticles = (req, res, next) => {
    selectAllArticles()
    .then((articles) => {
        res.status(200).send({articles})
    })
    .catch(next)
}
exports.getComments = (req, res, next) => {
    const articleID = req.params.article_id
    selectComments(articleID)
    .then((comments) => {
        res.status(200).send({comments})
    })
    .catch(next)
}