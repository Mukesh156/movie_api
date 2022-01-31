const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const app = express();
const mongoose = require("mongoose");
const Models = require("./models.js");
uuid = require("uuid");

const movies = Models.Movie;
const users = Models.User;

// mongoose.connect('mongodb://localhost:5500/dbname', { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connect("mongodb://0.0.0.0:27017/myFlixDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create a reference to the port on the hosted server
const port = process.env.PORT || 27017;

// Set up the server
app.listen(port, "0.0.0.0", () => {
  console.log("The server is listening on port " + port);
});
//morgan
app.use(morgan("common"));

//error handling
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Return a list of ALL movies to the user
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

// Return data about a genre by name
app.get("/genres/:genre", (req, res) => {
  movies
    .findOne({ "Genre.Name": req.params.genre })
    .then((movie) => {
      res.json(movie.Genre);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error" + err);
    });
});

// Return data about a single movie by title to the user
app.get("/movies/:title", (req, res) => {
  movies
    .findOne({ Title: req.params.title })
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// Return data about director by name
app.get("/directors/:directorName", (req, res) => {
  movies
    .findOne({ "Director.Name": req.params.directorName })
    .then((movie) => {
      res.json(movie.Director);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error" + err);
    });
});

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

// Find specific user by his Username
app.get("/users/:Username", (req, res) => {
  users
    .findOne({ userName: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error" + error);
    });
});

//Allow new user to register
app.post("/users", (req, res) => {
  users
    .findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + "already exists");
      } else {
        users
          .create({
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday,
          })
          .then((user) => {
            res.status(201).json(user);
          })
          .catch((error) => {
            console.error(error);
            res.status(500).send("Error: " + error);
          });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error: " + error);
    });
});

//Allow users to update their user info
app.put("/users/:Username", (req, res) => {
  users.findOneAndUpdate(
    { Username: req.params.Username },
    {
      $set: {
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday,
      },
    },
    { new: true },
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error: " + err);
      } else {
        res.json(updatedUser);
      }
    }
  );
});

// Add a movie to a user's list of favorites
app.post("/users/:Username/movies/:MovieID", (req, res) => {
  users.findOneAndUpdate(
    { Username: req.params.Username },
    {
      $push: { favouriteMovies: req.params.MovieID },
    },
    { new: true },
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error: " + err);
      } else {
        res.json(updatedUser);
      }
    }
  );
});

// Allow users to remove a movie from their list of favorites
app.delete("/users/:username/favouriteMovies/:movieID", (req, res) => {
  users.findOneAndUpdate(
    { Username: req.params.username },
    {
      $pull: { favouriteMovies: req.params.movieID },
    },
    { new: true }, // This line makes sure that the updated document is returned
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error: " + err);
      } else {
        res.json(updatedUser);
      }
    }
  );
});

//Allow existing users to deregister
app.delete("/users/:Username", (req, res) => {
  users
    .findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + " was not found");
      } else {
        res.status(200).send(req.params.Username + " was deleted.");
      }
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
  console.log("Your app is listening on port 0.0.0.0");
});
