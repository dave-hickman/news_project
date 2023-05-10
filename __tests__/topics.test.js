const app = require('../app')
const request = require('supertest')
const db = require('../db/connection')
const {articleData, commentData, topicData, userData} = require('../db/data/test-data/index')
const seed = require('../db/seeds/seed')

beforeEach(() => {
    return seed({articleData, commentData, topicData, userData})
});

afterAll(() => {
    return db.end()
})

describe('GET /api/topics', () => {
    it('should return the required keys with the correct value types', () => {
        return request(app).get('/api/topics')
        .expect(200)
        .then((response) => {
            expect(response.body.topics.length).toBe(3)
            response.body.topics.forEach((topic) => {
                expect(topic.hasOwnProperty('slug')).toBe(true);
                expect(topic.hasOwnProperty('description')).toBe(true);
                expect(typeof topic.slug).toBe('string');
                expect(typeof topic.description).toBe('string');
            })
        }
        )
        
    });
    it('should respond with a 404 error if the api path is not found', () => {
        return request(app).get('/api/toopics')
        .expect(404)
        .then((response) => {
         expect(response.body).toEqual({msg:'Invalid request!'})   
        }
        )
    });
});