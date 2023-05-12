const express = require('express')
const app = express()
const {getTopics} = require('./contollers/topics_controller')
const {getArticle, postComment, patchArticle, deleteComment} = require('./contollers/articles_controller')
const {getAllArticles} = require('./contollers/articles_controller')
const {getEndpoints} = require('./contollers/endpoints_controller')
const {getComments} = require('./contollers/articles_controller')

app.use(express.json())

app.get('/api/topics', getTopics)

app.get('/api/articles', getAllArticles)

app.get('/api/articles/:article_id', getArticle)

app.get('/api', getEndpoints)

app.get('/api/articles/:article_id/comments', getComments)

app.post('/api/articles/:article_id/comments', postComment)

app.patch('/api/articles/:article_id', patchArticle)

app.delete('/api/comments/:comment_id', deleteComment)

app.use((err, req, res, next) => {
        if (err.status && err.msg){
            res.status(err.status).send({err: err.msg})
        }
        else if (err.code === '23503'){
            res.status(404).send({msg: 'Input not found!'})
        }
        else if (err.code === '22P02'){
            res.status(400).send({msg: 'Invalid Input!'})
        }
        else{
            res.status(500).send({msg: 'Server Error'})
    }
});

app.use((req, res, next) => {
        res.status(404).send({msg: 'Invalid request!'})
    }
  );

module.exports = app
