const express = require('express')
const app = express()
const {getTopics} = require('./contollers/topics_controller')

app.get('/api/topics', getTopics)

app.get('api/articles/:article_id', getArticle)

app.use((req, res, next) => {
        res.status(404).send('Invalid request!')
    }
  );

module.exports = app
