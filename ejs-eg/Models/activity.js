const mongoose = require("mongoose");
//If parentLogId === 0, then it is a templated activity
/* TYPES THAT WE USE THUS FAR
  SetsAndReps
  TimeAndDistance
  SetsAndTime
  SetsAndDistance
  no -> flag for someone inserting a new activity to the general db
*/
const activitySchema = new mongoose.Schema({
  _id: Number,
  parentLogId: Number,
  activityName: String,
  activityType: String,
});

const Activities = new mongoose.model("Activities", activitySchema);
module.exports = Activities;
