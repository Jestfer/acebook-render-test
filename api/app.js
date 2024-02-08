const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const usersRouter = require("./routes/users");
const postsRouter = require("./routes/posts");
const authenticationRouter = require("./routes/authentication");
const commentsRouter = require("./routes/comments");
// const tokenChecker = require("./middleware/tokenChecker");

const app = express();

// Allow requests from any client
// docs: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
// docs: https://expressjs.com/en/resources/middleware/cors.html
app.use(cors());

//render/deployment handling
if (process.env.NODE_ENV === "production") {
  //*Set static folder up in production
  app.use(express.static("../frontend/dist"));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"))
  );
}

// Parse JSON request bodies, made available on `req.body`
app.use(bodyParser.json());

// API Routes
app.use("api/", commentsRouter);
app.use("/users", usersRouter);
app.use("/", postsRouter);
app.use("/tokens", authenticationRouter);
app.use("/like/:id", postsRouter);

// 404 Handler
app.use((_req, res) => {
  res.status(404).json({ err: "Error 404: Not Found" });
});

// Error handler
app.use((err, _req, res, _next) => {
  console.error(err);

  if (process.env.NODE_ENV === "development") {
    res.status(500).send(err.message);
  } else {
    res.status(500).json({ err: "Something went wrong" });
  }
});

if (process.env.NODE_ENV === "production") {
  //*Set static folder up in production
  // app.use(express.static("frontend/dist"));

  // app.get("*", (req, res) =>
  //   res.sendFile(path.resolve(__dirname, "../frontend", "dist", "index.html"))
  // );

  app.use(express.static(path.resolve(__dirname, '../frontend/dist')));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/dist/index.html"));
  });
}

module.exports = app;
