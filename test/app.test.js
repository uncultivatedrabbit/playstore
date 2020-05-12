const { expect } = require("chai");
const supertest = require("supertest");
const app = require("../app");

// verifies / endpoint returns a 200 response
describe("Express App", () => {
  it("should return a message from GET /", () => {
    return supertest(app).get("/").expect(200, "Homepage loaded");
  });
});

// verifies the apps endpoint returns a 200 response
// and contains json
// and the body of the response is an array
describe("GET /apps", () => {
  it("should return an array of apps", () => {
    return supertest(app)
      .get("/apps")
      .expect(200)
      .expect("Content-Type", /json/)
      .then((res) => {
        expect(res.body).to.be.an("array");
        expect(res.body).to.have.lengthOf.at.least(1);
        const app = res.body[0];
        expect(app).to.include.all.keys(
          "App",
          "Category",
          "Rating",
          "Reviews",
          "Size",
          "Installs",
          "Type",
          "Price",
          "Content Rating",
          "Genres",
          "Last Updated",
          "Current Ver",
          "Android Ver"
        );
      });
  });
});

// checks that the query params given are either 'app' or 'rating'
it("should be 400 if sort is incorrect", () => {
  return supertest(app)
    .get("/apps")
    .query({ sort: "random" })
    .expect(400, "Sort must be either app or rating");
});

// checks that the array sorts correctly when sorted by app
it("should sort by app name", () => {
  return supertest(app)
    .get("/apps")
    .query({ sorted: "app" })
    .expect(200)
    .expect("Content-Type", /json/)
    .then((res) => {
      expect(res.body).to.be.an("array");
      let sorted = true;
      let i = 0;
      while (i < res.body.length - 1) {
        const appAtIndex = res.body[i];
        const appAtIndexPlus1 = res.body[i + 1];
        if (appAtIndex.app < appAtIndexPlus1.app) {
          sorted = false;
          break;
        }
        i++;
      }
      expect(sorted).to.be.true;
    });
});


// checks that the array sorts correctly when sorted by rating
it("should sort by app name", () => {
  return supertest(app)
    .get("/apps")
    .query({ sorted: "rating" })
    .expect(200)
    .expect("Content-Type", /json/)
    .then((res) => {
      expect(res.body).to.be.an("array");
      let sorted = true;
      let i = 0;
      while (i < res.body.length - 1) {
        const appAtIndex = res.body[i];
        const appAtIndexPlus1 = res.body[i + 1];
        if (appAtIndex.rating < appAtIndexPlus1.rating) {
          sorted = false;
          break;
        }
        i++;
      }
      expect(sorted).to.be.true;
    });
});

// checks that the array sorts correctly when sorted by genre
it("should only display action apps", () => {
  return supertest(app)
    .get("/apps")
    .query({ genre: "action" })
    .expect(200)
    .expect("Content-Type", /json/)
    .then((res) => {
      expect(res.body).to.be.an("array");
      let correctGenre = true;
      let i = 0;
      while (i < res.body.length ) {
        const appAtIndex = res.body[i];
        if (!appAtIndex.Genres.includes('Action')) {
          correctGenre= false;
          break;
        }
        i++;
      }
      expect(correctGenre).to.be.true;
    });
});


