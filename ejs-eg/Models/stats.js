const mongoose = require("mongoose");
const userStats = new mongoose.Schema({
  _id: Number,
  userId: Number,
  name: String,
  startingPoint: Number,
  currentPoint: Number,
  endPoint: Number,
  units: String,
});
const UserStats = new mongoose.model("UserStats", userStats);
module.exports = UserStats;
