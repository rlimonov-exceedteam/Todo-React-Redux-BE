const mongoose = require("mongoose");

const { Schema } = mongoose;

const commentScheme = new Schema({
  userId: String,
  taskId: String,
  commentText: String,
  author: String,
  date: String
});

module.exports = Comment = mongoose.model("comment", commentScheme);