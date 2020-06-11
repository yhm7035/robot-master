const express = require("express");
const server = express();

const lgRouter = require('./routes');

server.use(express.json());
server.use(express.urlencoded({ extended: false }));

server.use(lgRouter);

module.exports = server