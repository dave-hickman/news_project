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
const JSONendpoints = require("../endpoints.json");

beforeEach(() => {
  return seed({ articleData, commentData, topicData, userData });
});

afterAll(() => {
  return db.end();
});

describe("GET /api", () => {
  it("should return a JSON object", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        const jsonData = response.body;
        expect(JSON.parse(jsonData.body)).toBeInstanceOf(Object);
      });
  });
  it("should return the same data as the original JSON file", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        const jsonData = response.body;
        const parsedEndpoints = JSON.parse(jsonData.body);
        expect(parsedEndpoints).toEqual(JSONendpoints);
      });
  });
});

describe("GET /api/topics", () => {
  it("should return the required keys have the correct value types", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        expect(response.body.topics.length).toBe(3);
        response.body.topics.forEach((topic) => {
          expect(typeof topic.slug).toBe("string");
          expect(typeof topic.description).toBe("string");
        });
      });
  });
  it("should respond with a 404 error if the api path is not found", () => {
    return request(app)
      .get("/api/toopics")
      .expect(404)
      .then((response) => {
        expect(response.body).toEqual({ msg: "Invalid request!" });
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  it("should return the required keys with the correct value types", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((response) => {
        expect(response.body.article.length).toBe(1);
        response.body.article.forEach((article) => {
          expect(article.article_id).toBe(1);
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
        expect(response.body).toEqual({ msg: "Invalid Input!" });
      });
  });
  it("should return 404 if given a number but unable to find it", () => {
    return request(app)
      .get("/api/articles/9999")
      .expect(404)
      .then((response) => {
        expect(response.body).toEqual({
          err: "No user found for user_id: 9999!",
        });
      });
  });
});

describe("GET /api/articles", () => {
  it("should return an array of objects with correct value types and no body", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        expect(response.body.articles.length > 0).toBe(true);
        response.body.articles.forEach((article) => {
          expect(typeof article.author).toBe("string");
          expect(typeof article.title).toBe("string");
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.votes).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
          expect(typeof article.comment_count).toBe("string");
          expect(article.hasOwnProperty("body")).toBe(false);
        });
      });
  });

  it("should return an array in descending date order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        expect(
          response.body.articles.every((article, index) => {
            return (
              index === 0 ||
              article.created_at < response.body.articles[index - 1].created_at
            );
          })
        ).toBe(true);
      });
  });

  it("should return 404 if path is not found", () => {
    return request(app)
      .get("/api/articless")
      .expect(404)
      .then((response) => {
        expect(response.body).toEqual({ msg: "Invalid request!" });
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  it("should return the correct value types", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((response) => {
        expect(response.body.comments.length === 11).toBe(true);
        response.body.comments.forEach((comment) => {
          expect(typeof comment.author).toBe("string");
          expect(typeof comment.article_id).toBe("number");
          expect(typeof comment.comment_id).toBe("number");
          expect(typeof comment.votes).toBe("number");
          expect(typeof comment.body).toBe("string");
          expect(typeof comment.created_at).toBe("string");
        });
      });
  });

  it("should return an array in descending date order", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((response) => {
        expect(response.body.comments).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  it("should return 400 if given wrong type of article_id", () => {
    return request(app)
      .get("/api/articles/dog/comments")
      .expect(400)
      .then((response) => {
        expect(response.body).toEqual({ msg: "Invalid Input!" });
      });
  });
  it("should return 404 if the number of the article isnt in the database", () => {
    return request(app)
      .get("/api/articles/999/comments")
      .expect(404)
      .then((response) => {
        expect(response.body).toEqual({ err: "Resource not found" });
      });
  });
  it("should respond with an empty array if given an article with no comments", () => {
    return request(app)
      .get("/api/articles/7/comments")
      .expect(200)
      .then((response) => {
        expect(response.body.comments.length).toBe(0);
      });
  });
});
describe("POST /api/articles/:article_id/comments", () => {
  it("should return object with requested properties", () => {
    const newComment = { username: "icellusedkars", body: "Hello there" };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then((response) => {
        expect(typeof response.body.comment[0].author).toBe("string");
        expect(typeof response.body.comment[0].body).toBe("string");
        expect(typeof response.body.comment[0].article_id).toBe("number");
      });
  });

  it("should return a 404 if given non-existent article ID", () => {
    const newComment = { username: "icellusedkars", body: "Hello there" };
    return request(app)
      .post("/api/articles/999/comments")
      .send(newComment)
      .expect(404)
      .then((response) => {
        expect(response.body).toEqual({ msg: "Input not found!" });
      });
  });

  it('should return a 400 if given an invalid article ID', () => {
    const newComment = { username: "icellusedkars", body: "Hello there" };
    return request(app)
      .post("/api/articles/dogs/comments")
      .send(newComment)
      .expect(400)
      .then((response) => {
        expect(response.body).toEqual({ msg: "Invalid Input!" });
      });
  });
});