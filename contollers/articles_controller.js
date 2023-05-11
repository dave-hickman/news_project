const {selectArticle, selectComments} = require('../models/articles_model')

exports.getArticle = (req,res,next) => {
    const articleID = req.params.article_id
    selectArticle(articleID)
    .then((article) => {
        res.status(200).send({article})
    })
    .catch(next)
}

exports.getComments = (req, res, next) => {
    selectComments()
    .then((comments) => {
        res.status(200).send({comments})
    })
}