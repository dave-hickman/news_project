const app = require('../app')
const request = require('supertest')
const db = require('../db/connection')
const {articleData, commentData, topicData, userData} = require('../db/data/test-data/index')
const seed = require('../db/seeds/seed')

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
            console.log(response.text)
            expect(JSON.parse(response.text)).toBeInstanceOf(Object)
        })
        
    });
    it('should contain GET /api key, api/topics and api/articles keys', () => {
        return request(app).get('/api')
        .expect(200)
        .then((response) => {
            const parsedEndpoints = JSON.parse(response.text)
            expect(parsedEndpoints.hasOwnProperty('GET /api')).toBe(true)
            expect(parsedEndpoints.hasOwnProperty('GET /api/topics')).toBe(true)
            expect(parsedEndpoints.hasOwnProperty('GET /api/articles')).toBe(true)
        })
        
    });
    it('should contain description queries and exampleResponse for each endpoint', () => {
        return request(app).get('/api')
        .expect(200)
        .then((response) => {
            const parsedEndpoints = JSON.parse(response.text)
            for (let endpointKey in parsedEndpoints){
                const endpoint = parsedEndpoints[endpointKey]
                expect(endpoint.hasOwnProperty('description')).toBe(true)
                expect(endpoint.hasOwnProperty('queries')).toBe(true)
                expect(endpoint.hasOwnProperty('exampleResponse')).toBe(true)
            }
        })
        
    });
});