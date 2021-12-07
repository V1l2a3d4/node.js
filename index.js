const express = require("express");
const PORT = process.env.PORT || 3000;
const server = express();
const path = require("path");
const nunjucks = require("nunjucks");
const templatesDir = path.join(__dirname, "templates");
const { writeRequests } = require("./writeLog.js");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/hillel", {});
mongoose.set("debug", true);

mongoose.connection.on("error", err => {
  console.error("MongoDB", err);
});
mongoose.connection.on("open", () => {
  console.log("MongoDB open");
});

server.use(express.urlencoded());
server.use(express.json());

nunjucks.configure(templatesDir, {
  express: server
});

server.locals.messages = [];
server.locals.logs = [];

setInterval(() => {
  writeRequests(server.locals.logs);
}, 60000);

server.use("/", require("./router"));

server.listen(PORT, () => {
  console.log(`server is listening on ${PORT}`);
});
