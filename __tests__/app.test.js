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
  test("400: Responds with an error message when given an id that is not in the table", () => {
    return request(app)
      .get("/api/articles/not-a-number")
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({ message: "Invalid ID" });
      });
  });
  test("404: Responds with an error message when given an id that is not in the table", () => {
    return request(app)
      .get("/api/articles/88888888")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toEqual("ID not found");
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
        console.log(articles);
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
