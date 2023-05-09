const express = require('express')
const app = express()
const {getTopics} = require('./contollers/topics_controller')
const {getArticle} = require('./contollers/articles_controller')

app.get('/api/topics', getTopics)

app.get('/api/articles/:article_id', getArticle)

app.use((err, req, res, next) => {
        if (err.status && err.msg){
            res.status(err.status).send({msg: err.msg})
        }
        if (err.code === '22P02'){
            res.status(400).send('Invalid Input!')
        }
        else next(err)
    }
  );

app.use((req, res, next) => {
        res.status(404).send('Invalid request!')
    }
  );

module.exports = app
