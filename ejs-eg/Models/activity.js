const mongoose = require("mongoose");
//If parentLogId === 0, then it is a templated activity
/* TYPES THAT WE USE THUS FAR
  SetsAndReps
  TimeAndDistance
  SetsAndTime
  SetsAndDistance
*/
const activitySchema = new mongoose.Schema({
  _id: Number,
  parentLogId: Number,
  activityName: String,
  activityType: String,
});

const Activities = new mongoose.model("Activities", activitySchema);
module.exports = Activities;
