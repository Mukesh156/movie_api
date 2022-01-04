const express = require("express");
const morgan = require("morgan");
const bodyParser = require('body-parser'),

const app = express();

//morgan
app.use(morgan("common"));

//error handling
app.use(bodyParser.json());


let topMovies = [
  {
    title: "The Shawshank Redemption",
    director: "Frank Darabont",
  },
  {
    title: "The Godfather",
    director: "Francis Ford Coppola",
  },
  {
    title: "The Dark Knight",
    director: "Christopher Nolan",
  },
  {
    title: "The Lords of Rings",
    director: "Peter Jackson",
  },
  {
    title: "The Matrix",
    director: "Lana Wachowski",
  },
  {
    title: "Star Wars",
    director: "Irvin Kershner",
  },
  {
    title: "Goodfellas",
    director: "Martin Scorsese",
  },
  {
    title: "Alien",
    director: "Ridley Scott",
  },
  {
    title: "Joker",
    director: "Todd Phillips",
  },
  {
    title: "Hamilton",
    director: "Thomas Kail",
  },
];

// GET requests
app.get("/", (req, res) => {
  res.send("Welcome to myFlix!");
});

app.get("/Movies", (req, res) => {
  res.json(topMovies);
});

app.use(express.static("public"));

//morgan
app.get("/secreturl", (req, res) => {
  res.send("This is a secret url with super top-secret content.");
});

//Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// listen for requests
app.listen(5500, () => {
  console.log("Your app is listening on port 5500.");
});
