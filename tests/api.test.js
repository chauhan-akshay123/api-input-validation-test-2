const request = require("supertest");
const { app } = require("../index.js");
const { validateGame, validateTournament } = require("../index.js");
const http = require("http");
const { describe, beforeEach } = require("node:test");
const { execPath } = require("process");

jest.mock("../index.js", () => {
  const actualModule = jest.requireActual("../index.js");
  return {
    ...actualModule,
    validateGame: jest.fn(),
    validateTournament: jest.fn(),
  };
});

let server;

beforeAll((done) => {
  server = http.createServer(app);
  server.listen(3001, done);
});

afterAll((done) => {
  server.close(done);
});

describe("API Endpoints to add data", () => {
 beforeEach(() => {
   jest.clearAllMocks();
 });

 it("Should add a new game with valid input", async () => {
  const response = await request(server).post("/api/games").send({
    title: 'The Legend of Zelda',
    genre: 'Adventure'
  });
 
  expect(response.statusCode).toEqual(201);
  expect(response.body).toEqual({
    id: 1, 
    title: "The Legend of Zelda",
    genre: "Adventure"
  });
});

it("Should return 400 for invalid game input", async () => {
 const response = await request(server).post("/api/games").send({title: "The Legend Of Zelda"});
 
 expect(response.statusCode).toEqual(400);
 expect(response.text).toEqual("Genre is required and should be a string.");
});

it("Should return 400 for invalid game input", async () => {
  const response = await request(server).post("/api/games").send({genre: "Adventure"});
  
  expect(response.statusCode).toEqual(400);
  expect(response.text).toEqual("Title is required and should be a string.");
 });
 
it("Should add a new tournament with valid input", async () => {
 const respnse = await request(server).post("/api/tournaments").send({
  name: 'Zelda Championship',
  gameId: 1
 }); 

 expect(respnse.statusCode).toEqual(201);
 expect(respnse.body).toEqual({
  id: 1,
  name: 'Zelda Championship',
  gameId: 1
 });
});

it("Should return 400 for invalid tournament input", async () => {
 const response = await request(server).post("/api/tournaments").send({'name': 'Zelda Championship'});

 expect(response.statusCode).toEqual(400);
 expect(response.text).toEqual("Game ID is required and should be a number.");
});

it("Should return 400 for invalid tournament input", async () => {
 const response = await request(server).post("/api/tournaments").send({'gameId': 1});

 expect(response.statusCode).toEqual(400);
 expect(response.text).toEqual("Name is required and should be a string.");
});
 
});

describe("Validation function test", () => {
 beforeEach(() => {
   jest.clearAllMocks();
 });

 it("Should validate game input correctly", async () => {
  
  expect(validateGame({'title': 'The Legend of Zelda',
  'genre': 'Adventure'})).toBeNull(null);
  expect(validateGame({'title': 'The Legend of Zelda'})).toEqual("Genre is required and should be a string.");
  expect(validateGame({'genre': 'Adventure'})).toEqual("Title is required and should be a string.");
 });

 it("Should validate tournament input correctly", async () => {
  
  expect(validateTournament({'name': 'Zelda Championship',
  'gameId': 1})).toBeNull();
  expect(validateTournament({'name': 'Zelda Championship'})).toEqual("Game ID is required and should be a number.");
  expect(validateTournament({'gameId': 1})).toEqual("Name is required and should be a string.");
 });

});