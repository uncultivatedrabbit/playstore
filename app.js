const express = require("express");
const morgan = require("morgan");
const app = express();
const playstore = require("./data/playstore");

app.use(morgan("common"));

app.get("/", (req, res) => {
  res.status(200).send("Homepage loaded");
});

app.get("/apps", (req, res) => {
  const { sorted, genre } = req.query;
  if (
    Object.keys(req.query).length !== 0 &&
    !req.query.sorted &&
    !req.query.genre
  ) {
    return res
      .status(400)
      .send('Sort must be either app or rating');
  }
  let results = playstore;
  // checks if user asked to sort the array
  if (sorted) {
    if (!["app", "rating"].includes(sorted)) {
      return res.status(400).send("Sort must be either by app name or rating");
    }
  }
  // checks if user inputted a genre to filter by
  if (genre) {
    if (
      !["action", "puzzle", "strategy", "casual", "arcade", "card"].includes(
        genre
      )
    ) {
      return res
        .status(400)
        .send(
          "Genre must be one of the following: Action, Puzzle, Strategy, Casual, Arcard, Card"
        );
    }
    // filters results to only include genre specified
    results = playstore.filter((app) => {
      return app.Genres.toLowerCase().includes(genre.toLowerCase());
    });
  }

  if (sorted) {
    // sorted results based on either app name or rating
    // sorted a -> z for app and the sort method is reversed for ratings
    results = results.sort((x, y) => {
      if (sorted === "app") {
        return x[
          sorted.charAt(0).toUpperCase() + sorted.slice(1)
        ].toLowerCase() >
          y[sorted.charAt(0).toUpperCase() + sorted.slice(1)].toLowerCase()
          ? 1
          : -1;
      } else {
        return x[sorted.charAt(0).toUpperCase() + sorted.slice(1)] <
          y[sorted.charAt(0).toUpperCase() + sorted.slice(1)]
          ? 1
          : -1;
      }
    });
  }
  res.json(results);
});

module.exports = app;
