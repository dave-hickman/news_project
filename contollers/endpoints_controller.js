const endpoints = require('../endpoints.json')

exports.getEndpoints = (req,res,next) => {
    res.status(200).send(JSON.stringify(endpoints, null, 2))
    .catch(next)
}