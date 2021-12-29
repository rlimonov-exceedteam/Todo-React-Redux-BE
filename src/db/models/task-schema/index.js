const mongoose = require("mongoose");

const { Schema } = mongoose;

const taskScheme = new Schema({
  userId: String,
  taskName: String,
  taskText: String,
  stage: Number,
});

module.exports = Task = mongoose.model("task", taskScheme);