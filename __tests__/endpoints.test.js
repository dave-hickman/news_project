const app = require('../app')
const request = require('supertest')
const db = require('../db/connection')
const {articleData, commentData, topicData, userData} = require('../db/data/test-data/index')
const seed = require('../db/seeds/seed')
const JSONendpoints = require('../endpoints.json')

beforeEach(() => {
    return seed({articleData, commentData, topicData, userData})
});

afterAll(() => {
    return db.end
})

describe('GET /api', () => {
    it('should return a JSON object', () => {
        return request(app).get('/api')
        .expect(200)
        .then((response) => {
            expect(JSON.parse(response.text)).toBeInstanceOf(Object)
        })
        
    });
    it('should return the same data as the original JSON file', () => {
        return request(app).get('/api')
        .expect(200)
        .then((response) => {
            const parsedEndpoints = JSON.parse(response.text)
            expect(parsedEndpoints).toEqual(JSONendpoints)
        })
        
    });
});