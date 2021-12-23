const mongoose = require("mongoose");

const { Schema } = mongoose;

const userScheme = new Schema({
  login: {type: String, unique: true},
  password: {type: String},
});

module.exports = User = mongoose.model("user", userScheme);
