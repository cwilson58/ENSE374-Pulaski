const mongoose = require("mongoose");
const activityLogSchema = new mongoose.Schema({
  _id: Number,
  date: Date,
  ownerId: Number,
});
const Logs = new mongoose.model("Logs", activityLogSchema);
module.exports = Logs;
