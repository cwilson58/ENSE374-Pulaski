const mongoose = require("mongoose");
const detailsSchema = new mongoose.Schema({
  _id: Number,
  activityId: Number,
  setNumber: Number,
  reps: Number,
  weight: Number,
  timeInSeconds: Number,
  distance: Number,
  units: String,
});
const Details = new mongoose.model("Details", detailsSchema);
module.exports = Details;
