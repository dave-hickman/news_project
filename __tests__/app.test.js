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
          err: "No article found for article_id: 9999!",
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
        expect(response.body.comment[0].author).toBe("icellusedkars");
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

  it("should return a 400 if given an invalid article ID", () => {
    const newComment = { username: "icellusedkars", body: "Hello there" };
    return request(app)
      .post("/api/articles/dogs/comments")
      .send(newComment)
      .expect(400)
      .then((response) => {
        expect(response.body).toEqual({ msg: "Invalid Input!" });
      });
  });
  it("should return a 404 if given a username that doesnt exist", () => {
    const newComment = { username: "BillyBob", body: "cba to register" };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(404)
      .then((response) => {
        expect(response.body).toEqual({ msg: "Input not found!" });
      });
  });
  it("should ignore additional properties in the comment", () => {
    const newComment = {
      username: "icellusedkars",
      body: "Hello there",
      votes: 1,
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then((response) => {
        expect(response.body.comment[0].author).toBe("icellusedkars");
        expect(response.body.comment[0].body).toBe("Hello there");
        expect(response.body.comment[0].votes).toBe(0);
      });
  });
  it("should return a 400 if body isnt sent", () => {
    const newComment = { username: "icellusedkars" };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(400)
      .then((response) => {
        expect(response.body).toEqual({ err: "Missing inputs!" });
      });
  });
});

describe("8. PATCH /api/articles/:article_id", () => {
  it("should return an article with increased vote", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: 2 })
      .expect(200)
      .then((response) => {
        expect(response.body.article[0].votes).toBe(102);
        expect(response.body.article[0].article_id).toBe(1);
        expect(typeof response.body.article[0].title).toBe("string");
        expect(typeof response.body.article[0].topic).toBe("string");
        expect(typeof response.body.article[0].author).toBe("string");
        expect(typeof response.body.article[0].body).toBe("string");
        expect(typeof response.body.article[0].created_at).toBe("string");
        expect(typeof response.body.article[0].article_img_url).toBe("string");
      });
  });
  it("should return an article with a decreased vote", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: -10 })
      .expect(200)
      .then((response) => {
        expect(response.body.article[0].votes).toBe(90);
        expect(response.body.article[0].article_id).toBe(1);
        expect(typeof response.body.article[0].title).toBe("string");
        expect(typeof response.body.article[0].topic).toBe("string");
        expect(typeof response.body.article[0].author).toBe("string");
        expect(typeof response.body.article[0].body).toBe("string");
        expect(typeof response.body.article[0].created_at).toBe("string");
        expect(typeof response.body.article[0].article_img_url).toBe("string");
      });
  });
  it("should return a 400 if no inc_votes is provided", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ change_body: "Hello there" })
      .expect(400)
      .then((response) => {
        expect(response.body).toEqual({ err: "Missing inputs!" });
      });
  });
  it("should ignore any other property than inc_votes", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: 1, change_body: "Hello there" })
      .expect(200)
      .then((response) => {
        expect(response.body.article[0].body).toEqual(
          "I find this existence challenging"
        );
      });
  });
  it("should return 404 if article name doesnt exist", () => {
    return request(app)
      .patch("/api/articles/9999")
      .send({ inc_votes: 2 })
      .expect(404)
      .then((response) => {
        expect(response.body).toEqual({
          err: "No article found for article_id: 9999!",
        });
      });
  });
  it("should return a 400 if given an invalid article_id", () => {
    return request(app)
      .patch("/api/articles/dogs")
      .send({ inc_votes: 2 })
      .expect(400)
      .then((response) => {
        expect(response.body).toEqual({ msg: "Invalid Input!" });
      });
  });
});

describe("DELETE /api/articles/:comment_id", () => {
  it("should remove comment and return 204 status with no content", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .then((response) => {
        expect(response.body).toEqual({});
      });
  });
  it("should return 400 if given an invalid comment_id", () => {
    return request(app)
      .delete("/api/comments/dogs")
      .expect(400)
      .then((response) => {
        expect(response.body).toEqual({ msg: "Invalid Input!" });
      });
  });
  it("should return 404 if comment doesnt exist", () => {
    return request(app)
      .delete("/api/comments/9999")
      .expect(404)
      .then((response) => {
        expect(response.body).toEqual({
          err: "No comment found for comment_id: 9999!",
        });
      });
  });
});

describe('GET /api/users', () => {
  it('should provide an object of all users with correct properties', () => {
    return request(app)
    .get('/api/users')
    .expect(200)
    .then((response) => {
      expect(response.body.users.length === 4)
      response.body.users.forEach((user) => {
        expect(typeof user.username).toBe('string')
        expect(typeof user.name).toBe('string')
        expect(typeof user.avatar_url).toBe('string')
      })
    })
    
  });
  it("should return 404 if path is not found", () => {
    return request(app)
      .get("/api/userss")
      .expect(404)
      .then((response) => {
        expect(response.body).toEqual({ msg: "Invalid request!" });
      });
  });
});