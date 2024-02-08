const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const usersRouter = require("./routes/users");
const postsRouter = require("./routes/posts");
const authenticationRouter = require("./routes/authentication");
const commentsRouter = require("./routes/comments");

const app = express();

app.use(cors());
app.use(bodyParser.json());

// API Routes
app.use("/api/comments", commentsRouter); // Fixed the route prefix here
app.use("/api/users", usersRouter);
app.use("/api/posts", postsRouter);
app.use("/api/tokens", authenticationRouter);

// Static files and SPA fallback in production
if (process.env.NODE_ENV === "production") {
  console.log("Setting up static files from:", path.resolve(__dirname, '../frontend/dist'));
  app.use(express.static(path.resolve(__dirname, '../frontend/dist')));

  app.get("*", (req, res) => {
    const indexPath = path.resolve(__dirname, "../frontend/dist/index.html");
    console.log("Attempting to send file from:", indexPath);
    res.sendFile(indexPath);
  });
}

// 404 Handler should be after API and static routes
app.use((_req, res) => {
  res.status(404).json({ err: "Error 404: Not Found" });
});

// General error handler
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ err: "Something went wrong" });
});

module.exports = app;
