const {selectArticle, sendComment} = require('../models/articles_model')
const {selectAllArticles} = require('../models/articles_model')

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

exports.postComment = (req, res, next) => {
    const articleID = req.params.article_id
    const commentInfo = req.body
    sendComment(articleID, commentInfo)
    .then((comment) => {
        res.status(202).send({comment})
    })
    .catch(next)
}