const request = require("supertest");
const db = require("../db/connection");
const testData = require("../db/data/test-data/index");
const app = require("../app");
const seed = require("../db/seeds/seed");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  db.end();
});

describe("GET /api/topics", () => {
  test("200: Responds with an array of objects, each of which should have a 'slug' and 'description' property", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
        expect(Array.isArray(topics)).toBe(true);
        expect(topics.length).toBeGreaterThan(0);
        topics.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
  test("200: should return all 3 objects in the test data", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual({
          topics: [
            {
              description: "The man, the Mitch, the legend",
              slug: "mitch",
            },
            {
              description: "Not dogs",
              slug: "cats",
            },
            {
              description: "what books are made of",
              slug: "paper",
            },
          ],
        });
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: Responds with a single article object with the correct properties", () => {
    return request(app)
      .get("/api/articles/8")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(typeof article).toBe("object");
        expect(article).toMatchObject({
          article_id: expect.any(Number),
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          article_img_url: expect.any(String),
          votes: expect.any(Number),
        });
      });
  });
  test("200: Responds with the requested article object", () => {
    return request(app)
      .get("/api/articles/8")
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual({
          article: {
            article_id: 8,
            title: "Does Mitch predate civilisation?",
            topic: "mitch",
            author: "icellusedkars",
            body: "Archaeologists have uncovered a gigantic statue from the dawn of humanity, and it has an uncanny resemblance to Mitch. Surely I am not the only person who can see this?!",
            created_at: "2020-04-17T01:08:00.000Z",
            votes: 0,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          },
        });
      });
  });
  test("400: Responds with an error message when the input ID is not a number", () => {
    return request(app)
      .get("/api/articles/not-a-number")
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({ message: "Invalid Request" });
      });
  });
  test("404: Responds with an error message when given an id number does not correspond with an id in the table", () => {
    return request(app)
      .get("/api/articles/88888888")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toEqual("Invalid URL");
      });
  });
});

describe("GET /api/articles", () => {
  test("200: Responds with an array of all the article objects, each with the relevant properties ", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(Array.isArray(articles)).toBe(true);
        expect(articles).toHaveLength(12);
        articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
        });
      });
  });
  test("200: Array is ordered by date created descending first", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toHaveLength(12);
        expect(articles).toBeSorted("created_at", { descending: true });
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200: Responds with an array of comments from a specified article id", () => {
    return request(app)
      .get("/api/articles/5/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toBeInstanceOf(Array);
        expect(comments).toHaveLength(2);
        expect(comments).toBeSorted("created_at", { descending: true });
        comments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              article_id: expect.any(Number),
            })
          );
        });
      });
  });
  test("200: Responds with an array arranged by time created with the most recent first", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toBeInstanceOf(Array);
        expect(comments).toHaveLength(11);
        expect(comments).toBeSorted("created_at", { descending: true });
      });
  });
  test("200: Reaponds with an empty array if there are no comments", () => {
    return request(app)
      .get("/api/articles/7/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toEqual([]);
      });
  });
  test("400: Responds with an error message when the input ID is not a number", () => {
    return request(app)
      .get("/api/articles/not-a-number/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({ message: "Invalid Request" });
      });
  });
  test("404: Responds with an error message when given an id number does not correspond with an id in the table", () => {
    return request(app)
      .get("/api/articles/88888888/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toEqual("ID does not exist");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("201: Request body accepts an object with a username and body properties", () => {
    const newComment = {
      username: "butter_bridge",
      body: "Hello World!",
    };
    return request(app)
      .post(`/api/articles/1/comments`)
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        const { comment } = body;
        expect(typeof comment).toBe("object");
        expect(comment).toMatchObject({
          comment_id: expect.any(Number),
          body: "Hello World!",
          votes: 0,
          author: "butter_bridge",
          article_id: 1,
          created_at: expect.any(String),
        });
      });
  });
  test("400: Responds with an error message when the input ID is not a number", () => {
    const newComment = {
      username: "butter_bridge",
      body: "Hello World!",
    };
    return request(app)
      .post("/api/articles/not-a-number/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({ message: "Invalid Request" });
      });
  });
  test("404: Responds with an error message when given an id number does not correspond with an id in the table", () => {
    const newComment = {
      username: "butter_bridge",
      body: "Hello World!",
    };
    return request(app)
      .post("/api/articles/88888888/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toEqual("ID does not exist");
      });
  });
  test("404: Responds with an error message when given user does not exist in user table", () => {
    const newComment = {
      username: "Does_not_exist",
      body: "Hello World!",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toEqual("User does not exist");
      });
  });
  test("400: Responds with an error message when input comment is not made up of string data", () => {
    const newComment = {
      username: 7,
      body: 42,
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toEqual("User does not exist");
      });
  });
  test("400: Responds with an error message when comment object is left empty", () => {
    const newComment = {};
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toEqual("Invalid Request: Empty Request");
      });
  });
  test("400: Responds with an error if extra properties are input in the POST request", () => {
    const newComment = {
      username: "butter_bridge",
      body: "Hello World!",
      phone_number: 1234567890,
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toEqual(
          "Invalid Request: Please only add username and body properties"
        );
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("200: Responds with updated articles object with votes increased by specified amount", () => {
    const newVotes = { inc_votes: 2 };
    return request(app)
      .patch(`/api/articles/1`)
      .send(newVotes)
      .expect(201)
      .then(({ body }) => {
        expect(typeof body).toBe("object");
        expect(body).toMatchObject({
          article_id: expect.any(Number),
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: 102,
        });
      });
  });
  test("400: Responds with an error when a non interger is input to the votes function", () => {
    const newVotes = { inc_votes: "string" };
    return request(app)
      .patch(`/api/articles/1`)
      .send(newVotes)
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({
          message: "Invalid Request",
        });
      });
  });
  test("400: Responds with an error message when the input ID is not a number", () => {
    const newVotes = { inc_votes: 2 };
    return request(app)
      .patch("/api/articles/not-a-number")
      .send(newVotes)
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({
          message: "Invalid Request",
        });
      });
  });
  test("404: Responds with an error message when given an id number does not correspond with an id in the table", () => {
    const newVotes = { inc_votes: 2 };
    return request(app)
      .patch("/api/articles/88888888")
      .send(newVotes)
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toEqual("ID does not exist");
      });
  });
  test("400: Responds with an error if the votes object is left empty", () => {
    const newVotes = {};
    return request(app)
      .patch("/api/articles/1")
      .send(newVotes)
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toEqual("Invalid Request: Empty Request");
      });
  });
  test("400: Responds with an error if extra properties are input in the PATCH request", () => {
    const newVotes = { inc_votes: 2, extraProperty: true };
    return request(app)
      .patch("/api/articles/1")
      .send(newVotes)
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toEqual(
          "Invalid Request: Please only add username and body properties"
        );
      });
  });
});
