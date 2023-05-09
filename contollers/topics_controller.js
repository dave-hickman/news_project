const {selectTopics} = require('../models/topics_model')

exports.getTopics = (req,res,next) => {
    selectTopics()
    .then((topics) => {
        res.status(200).send({topics: topics})
    })
    .catch(next)
}