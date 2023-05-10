const express = require('express')
const app = express()
const {getTopics} = require('./contollers/topics_controller')
const {getArticle} = require('./contollers/articles_controller')
const {getEndpoints} = require('./contollers/endpoints_controller')

app.use(express.json())

app.get('/api/topics', getTopics)

app.get('/api/articles/:article_id', getArticle)

app.get('/api', getEndpoints)

app.use((err, req, res, next) => {
        if (err.status && err.msg){
            res.status(err.status).send(err.msg)
        }
        if (err.code === '22P02'){
            res.status(400).send('Invalid Input!')
        }
        if (err.code === 500){
            res.status(500).send('Server Error')
        }
        else next(err)
    }
  );


app.use((req, res, next) => {
        res.status(404).send('Invalid request!')
    }
  );

module.exports = app
