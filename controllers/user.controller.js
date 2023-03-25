const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const saltRounds = 10;
const secret = process.env.SECRET;

exports.create = async (req, res) => {
  try {
    if (!req.body.username || !req.body.password) {
      res.json("username or password missing");
    } else {
      const checkUser = await User.find({
        username: req.body.username,
      });
      if (checkUser[0]) {
        res.status(403).json({ message: "this user already exists!" });
      } else {
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
        const user = await User.create({
          username: req.body.username,
          password: hashedPassword,
        });
        res.json({ message: "success!", user });
      }
    }
  } catch (err) {
    res.json(err);
  }
};

exports.login = async (req, res) => {
  try {
    const foundUser = await User.findOne({ username: req.body.username });
    if (foundUser) {
      const userStatus = await bcrypt.compare(
        req.body.password,
        foundUser.password
      );
      if (userStatus) {
        jwt.sign({ foundUser }, secret, (err, token) => {
          res.json({
            message: "user logged in now",
            user: foundUser,
            token: token,
          });
        });
      } else {
        res.status(401).json("username or password incorrect!");
      }
    } else {
      res.json("user not found");
    }
  } catch (err) {
    res
      .status(404)
      .json({ message: "another error occured", error: err.message });
  }
};

exports.findOne = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findOne({ _id: userId });
    res.json(user);
  } catch (err) {
    res.json({ message: "failed to fetch data", error: err.message });
  }
};

exports.addTodo = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (token) {
      const verified = jwt.verify(token, secret);
      if (verified) {
        const userId = req.params.userId;
        const user = await User.findOne({ _id: userId.toString() });
        const todo = user.todos.find((item) => item.todo === req.body.todo);
        if (!todo) {
          const id = Math.ceil(Math.random() * Date.now());
          user.todos.push({ todo: req.body.todo, id: id });
          const updatedUser = await User.findOneAndUpdate(
            { _id: userId },
            { ...user }
          );
          res.json({ message: "success", todos: user.todos });
        } else {
          res.json("this todo already exists!");
        }
      }
    } else {
      res.status(403).json("not authorized!");
    }
  } catch (err) {
    res.json({ message: "another error", error: err.message });
  }
};

exports.updateTodo = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findOne({ _id: userId });
    const todo = user.todos.find(
      (item) => item.id === req.params.todoId.toString()
    );
    todo.completed = !todo.completed;
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { ...user }
    );
    res.json("todo updated successfully");
  } catch (err) {
    res.json({ error: err.message });
  }
};

exports.deleteTodo = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findOne({ _id: userId });
    const updatedTodos = user.todos.filter(
      (item) => item.id !== req.params.todoId.toString()
    );
    user.todos = updatedTodos;
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { ...user }
    );
    const newUpdatedTodos = await User.findOne({ _id: userId });
    res.json(newUpdatedTodos);
  } catch (err) {
    res.json({ error: err.message });
  }
};
