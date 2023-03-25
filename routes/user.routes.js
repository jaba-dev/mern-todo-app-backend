const express = require("express");
const User = require("../controllers/user.controller");
const router = express.Router();
const verifyToken = require("../controllers/verifyToken");

router.get("/:userId", verifyToken, User.findOne);
router.post("/signup", User.create);
router.post("/login", User.login);
router.post("/:userId/todos", verifyToken, User.addTodo);
router.patch("/:userId/todos/:todoId/edit", verifyToken, User.updateTodo);
router.delete("/:userId/todos/:todoId", verifyToken, User.deleteTodo);

module.exports = router;
