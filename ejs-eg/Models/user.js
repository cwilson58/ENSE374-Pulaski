const mongoose = require("mongoose");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const userSchema = new mongoose.Schema({
  _id: Number,
  email: String,
  username: String,
  password: String,
});
userSchema.plugin(passportLocalMongoose);
const Users = new mongoose.model("User", userSchema);
module.exports = Users;
