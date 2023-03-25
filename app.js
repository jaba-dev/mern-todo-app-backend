require("dotenv").config();
const express = require("express");
const app = express();
const connectDB = require("./config");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://mern-todo-app.onrender.com",
      "http://mern-todo-app-backend-wstm.onrender.com",
      "https://mern-todo-app-2x5j.onrender.com",
    ],
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan("tiny"));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to todo-app." });
});

app.use("/api/users", require("./routes/user.routes"));

app.use(function (req, res, next) {
  let err = new Error("Not Found");
  err.status = 404;
  next(err);
});

if (app.get("env") === "development") {
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.send({ message: err.message, error: err });
  });
}

const PORT = process.env.PORT || 8080;

async function start() {
  try {
    await connectDB(process.env.MONGO_URI);
    console.log("connected to database");
    app.listen(PORT, () => {
      console.log("server started on port 8080!");
    });
  } catch (error) {
    console.log(error.message);
  }
}

start();
