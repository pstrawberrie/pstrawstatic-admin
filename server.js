const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { JsonDB } = require("node-json-db");
const { Config } = require("node-json-db/dist/lib/JsonDBConfig");

const app = express();
const db = new JsonDB(new Config("./data/strawstatic", true, false, "/"));

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("client"));

// Routes
require("./routes.js")(app, db);

// Start Server
const server = app.listen(3001, () => {
  console.log("Strawstatic Admin @ %s...", server.address().port);
});
