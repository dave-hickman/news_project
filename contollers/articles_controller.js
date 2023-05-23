const {selectArticle, sendComment, selectComments, selectAllArticles, editArticle, removeComment, selectUsers} = require('../models/articles_model')

exports.getArticle = (req,res,next) => {
    const articleID = req.params.article_id
    selectArticle(articleID)
    .then((article) => {
        res.status(200).send({article})
    })
    .catch(next)
}

exports.getAllArticles = (req, res, next) => {
    const {topic} = req.query
    const sortBy = req.query.sort_by
    const {order} = req.query
    selectAllArticles(topic, sortBy, order)
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

exports.getUsers = (req, res, next) => {
    selectUsers()
    .then((users) => {
        res.status(200).send({users})
    })
    .catch(next)
}

exports.postComment = (req, res, next) => {
    const articleID = req.params.article_id
    const commentInfo = req.body
    sendComment(articleID, commentInfo)
    .then((comment) => {
        res.status(201).send({comment})
    })
    .catch(next)
}

exports.patchArticle = (req, res, next) => {
    const articleID =req.params.article_id
    const voteBody = req.body
    editArticle(articleID, voteBody)
    .then((article) => {
        res.status(200).send({article})
    })
    .catch(next)
}

exports.deleteComment = (req, res, next) => {
    const commentID = req.params.comment_id
    removeComment(commentID)
    .then(() => {
        res.status(204).send()
    })
    .catch(next)
}