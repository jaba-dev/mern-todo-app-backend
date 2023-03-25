const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: { type: String, unique: true },
  todos: [
    {
      todo: String,
      id: String,
      completed: {
        type: Boolean,
        default: false,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});
userSchema.plugin(uniqueValidator);
const User = mongoose.model("User", userSchema);
module.exports = User;
