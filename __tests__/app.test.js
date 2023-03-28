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
        expect(typeof body).toBe("object");
        expect(body).toMatchObject({
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
