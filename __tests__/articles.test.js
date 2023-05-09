const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const {
  articleData,
  commentData,
  topicData,
  userData,
} = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");

beforeEach(() => {
  return seed({ articleData, commentData, topicData, userData });
});

afterAll(() => {
  return db.end;
});

describe("GET /api/articles/:article_id", () => {
  it("should return the required keys with the correct value types", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((response) => {
        expect(response.body.article.length).toBe(1);
        response.body.article.forEach((article) => {
          expect(article.hasOwnProperty("article_id")).toBe(true);
          expect(article.hasOwnProperty("title")).toBe(true);
          expect(article.hasOwnProperty("topic")).toBe(true);
          expect(article.hasOwnProperty("author")).toBe(true);
          expect(article.hasOwnProperty("body")).toBe(true);
          expect(article.hasOwnProperty("created_at")).toBe(true);
          expect(article.hasOwnProperty("votes")).toBe(true);
          expect(article.hasOwnProperty("article_img_url")).toBe(true);
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.title).toBe("string");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.author).toBe("string");
          expect(typeof article.body).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.votes).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
        });
      });
  });
  it("should return 400 if given an ID that is not a number", () => {
    return request(app)
      .get("/api/articles/dog")
      .expect(400)
      .then((response) => {
        expect(response.text).toBe("Invalid Input!");
      });
  });
  it('should return 404 if given a number but unable to find it', () => {
    return request(app)
    .get("/api/articles/9999")
    .expect(404)
    .then((response) => {
      expect(response.text).toBe("No user found for user_id: 9999!");
    });
    
  });
});
