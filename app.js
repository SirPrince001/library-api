require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const routes = require("./src/routes/index");
const app = express();

app.get("/", (req, res) => {
  res.send("Welcome to our Library Management System");
});

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use("/api/v1", routes);
require("./src/database/db").connectDB();

app.use((err, req, res, next) => {
  const statusCode = err.statusCode ? err.statusCode : 500;
  const message = err.message ? err.message : "Internal server error";
  return res.status(statusCode).json({ success: false, message });
});

module.exports = app;
