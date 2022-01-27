const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const app = express();
const mongoose = require("mongoose");
const Models = require("./models.js");
uuid = require("uuid");

const movies = Models.Movie;
const users = Models.User;

mongoose.connect("mongodb://localhost:27017/myFlixDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//morgan
app.use(morgan("common"));

//error handling
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Get all users
app.get("/users", (req, res) => {
  users
    .find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// Get all users
app.get("/movies", (req, res) => {
  movies
    .find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

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
