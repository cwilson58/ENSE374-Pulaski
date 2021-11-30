/*
Made by Cameron Wilson
November 2021
makes a test instance of the database for project PAT, including users, activites and user specific statistics. Ends itself at the end.
*/
//Requires
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const express = require("express");
require("dotenv").config();
//Collections
const Users = require("./Models/user");
const UserStats = require("./Models/stats");
const Activities = require("./Models/activity");
const Logs = require("./Models/logs");
const Details = require("./Models/details");
//mongo and passport connection
mongoose.connect("mongodb://localhost:27017/projectPAT", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
//set up app for our use case
const app = express();

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
async function saveActivities() {
  var Activity = new Activities({
    _id: 0,
    parentLogId: 0,
    activityName: "Jogging",
    activityType: "TimeAndDistance",
  });
  await Activity.save();
  Activity = new Activities({
    _id: 1,
    parentLogId: 0,
    activityName: "Walking",
    activityType: "TimeAndDistance",
  });
  await Activity.save();
  Activity = new Activities({
    _id: 2,
    parentLogId: 0,
    activityName: "Bench Press",
    activityType: "SetsAndReps",
  });
  await Activity.save();
  Activity = new Activities({
    _id: 3,
    parentLogId: 0,
    activityName: "Sprints",
    activityType: "SetsAndTime",
  });
  await Activity.save();
  Activity = new Activities({
    _id: 4,
    parentLogId: 0,
    activityName: "Squats",
    activityType: "SetsAndReps",
  });
  await Activity.save();
  Activity = new Activities({
    _id: 5,
    parentLogId: 0,
    activityName: "Laps",
    activityType: "SetsAndDistance",
  });
  await Activity.save();
}

async function makeDbs() {
  placeHolderLog = Logs({
    _id: 0,
    date: null,
    ownerId: null,
  });
  await placeHolderLog.save();
  await saveActivities();
  console.log("projectPAT database has been created!");
  process.exit(1); //Make sure everything saves then exit the js program
}
makeDbs();
