const express = require("express");
const app = express();
app.use(express.json());

let games = [];
let tournaments = [];

// Function to validate game
function validateGame(game) {
  if (!game.title || typeof game.title !== "string") {
    return "Title is required and should be a string.";
  }
  if (!game.genre || typeof game.genre !== "string") {
    return "Genre is required and should be a string.";
  }
  return null;
}

// Function to validate tournament
function validateTournament(tournament) {
  if (!tournament.name || typeof tournament.name !== "string") {
    return "Name is required and should be a string.";
  }
  if (!tournament.gameId || typeof tournament.gameId !== "number") {
    return "Game ID is required and should be a number.";
  }
  return null;
}

// API to add a new game
app.post("/api/games", (req, res) => {
  let error = validateGame(req.body); 
  if (error) return res.status(400).send(error);

  let game = { id: games.length + 1, ...req.body };
  games.push(game);
  res.status(201).json(game);
});

// API to add a new tournament
app.post("/api/tournaments", (req, res) => {
  let error = validateTournament(req.body); 
  if (error) return res.status(400).send(error);

  let tournament = { id: tournaments.length + 1, ...req.body };
  tournaments.push(tournament);
  res.status(201).json(tournament);
});

module.exports = { app, validateGame, validateTournament };
