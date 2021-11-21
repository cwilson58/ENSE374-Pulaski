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

//Schema
//these are stored in plain text for testing reasons, however, new users should have passwords salted and hashed
const userSchema = new mongoose.Schema({
  _id: Number,
  username: String,
  password: String,
});

//user stats/goals collection
const userStats = new mongoose.Schema({
  _id: Number,
  userId: Number,
  name: String,
  startingPoint: Number,
  currentPoint: Number,
  endPoint: Number,
  units: String,
});
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
const activityLogSchema = new mongoose.Schema({
  _id: Number,
  date: Date,
  ownerId: Number,
});
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

userSchema.plugin(passportLocalMongoose);
//Collections
const Users = new mongoose.model("User", userSchema);
const UserStats = new mongoose.model("UserStats", userStats);
const Activities = new mongoose.model("Activities", activitySchema);
const Logs = new mongoose.model("Logs", activityLogSchema);
const Details = new mongoose.model("Details", detailsSchema);
//users: NOTE FOR TESTING ONLY
async function saveUsers() {
  var user = new Users({
    _id: 0,
    username: "CameronTestUser",
    password: "Cameron",
  });
  await user.save();
  user = new Users({
    _id: 1,
    username: "MichaelTestUser",
    password: "Michael",
  });
  await user.save();

  user = new Users({
    _id: 2,
    username: "JustineTestUser",
    password: "Justine",
  });
  await user.save();
  user = new Users({
    _id: 3,
    username: "OtherTestUser",
    password: "ENSE374",
  });
  await user.save();
  console.log("Users have been saved!");
}
//Stats for test users
async function saveStats() {
  var usersStats = new UserStats({
    _id: 0,
    userId: 0,
    name: "Weight",
    startingPoint: 100,
    currentPoint: 150,
    endPoint: 200,
    units: "lbs",
  });
  await usersStats.save();
  usersStats = new UserStats({
    _id: 1,
    userId: 1,
    name: "Weight",
    startingPoint: 10,
    currentPoint: 50,
    endPoint: 120,
    units: "lbs",
  });
  await usersStats.save();
  usersStats = new UserStats({
    _id: 2,
    userId: 2,
    name: "Weight",
    startingPoint: 120,
    currentPoint: 110,
    endPoint: 100,
    units: "lbs",
  });
  await usersStats.save();
  usersStats = new UserStats({
    _id: 3,
    userId: 3,
    name: "Weight",
    startingPoint: 20,
    currentPoint: 25,
    endPoint: 62,
    units: "Kg",
  });
  await usersStats.save();
  console.log("userStats Saved");
}
//Test users logs
async function saveLogs() {
  var logs = new Logs({
    _id: 8,
    date: "2021-11-11",
    ownerId: 0,
  });
  await logs.save();
  logs = new Logs({
    _id: 1,
    date: "2021-12-22",
    ownerId: 0,
  });
  await logs.save();
  logs = new Logs({
    _id: 2,
    date: "2021-11-11",
    ownerId: 1,
  });
  await logs.save();
  logs = new Logs({
    _id: 3,
    date: "2021-12-11",
    ownerId: 1,
  });
  await logs.save();
  logs = new Logs({
    _id: 4,
    date: "2021-11-11",
    ownerId: 2,
  });
  await logs.save();
  logs = new Logs({
    _id: 5,
    date: "2021-12-11",
    ownerId: 2,
  });
  await logs.save();
  logs = new Logs({
    _id: 6,
    date: "2021-11-11",
    ownerId: 3,
  });
  await logs.save();
  logs = new Logs({
    _id: 7,
    date: "2021-12-11",
    ownerId: 3,
  });
  await logs.save();
  console.log("Logs Saved");
}
//Activites in the db that can be logged
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
  //Activities the test users have logged
  Activity = new Activities({
    _id: 6,
    parentLogId: 8,
    activityName: "Laps",
    activityType: "SetsAndDistance",
  });
  await Activity.save();
  Activity = new Activities({
    _id: 7,
    parentLogId: 1,
    activityName: "Squats",
    activityType: "SetsAndReps",
  });
  await Activity.save();
  Activity = new Activities({
    _id: 8,
    parentLogId: 2,
    activityName: "Squats",
    activityType: "SetsAndReps",
  });
  await Activity.save();
  Activity = new Activities({
    _id: 9,
    parentLogId: 3,
    activityName: "Jogging",
    activityType: "TimeAndDistance",
  });
  await Activity.save();
  Activity = new Activities({
    _id: 10,
    parentLogId: 4,
    activityName: "Bench Press",
    activityType: "SetsAndReps",
  });
  await Activity.save();
  Activity = new Activities({
    _id: 11,
    parentLogId: 5,
    activityName: "Bench Press",
    activityType: "SetsAndReps",
  });
  await Activity.save();
  Activity = new Activities({
    _id: 12,
    parentLogId: 6,
    activityName: "Squats",
    activityType: "SetsAndReps",
  });
  await Activity.save();
  Activity = new Activities({
    _id: 13,
    parentLogId: 7,
    activityName: "Laps",
    activityType: "SetsAndDistance",
  });
  await Activity.save();
  console.log("Activities Saved");
}
//Set and Rep type activites logged ->up to 12
async function saveDetails() {
  var detail = new Details({
    _id: 0,
    activityId: 1,
    setNumber: 1,
    reps: 0,
    weight: 0,
    timeInSeconds: 180,
    distance: 45,
    units: "meters",
  });
  await detail.save();
  detail = new Details({
    _id: 1,
    activityId: 2,
    setNumber: 1,
    reps: 12,
    weight: 135,
    timeInSeconds: 0,
    distance: 0,
    units: "pounds",
  });
  await detail.save();
  detail = new Details({
    _id: 2,
    activityId: 2,
    setNumber: 2,
    reps: 12,
    weight: 135,
    timeInSeconds: 0,
    distance: 0,
    units: "pounds",
  });
  await detail.save();
  detail = new Details({
    _id: 3,
    activityId: 2,
    setNumber: 3,
    reps: 12,
    weight: 135,
    timeInSeconds: 0,
    distance: 0,
    units: "pounds",
  });
  await detail.save();
  detail = new Details({
    _id: 4,
    activityId: 3,
    setNumber: 1,
    reps: 0,
    weight: 0,
    timeInSeconds: 30,
    distance: 0,
    units: "",
  });
  await detail.save();
  detail = new Details({
    _id: 5,
    activityId: 3,
    setNumber: 2,
    reps: 0,
    weight: 0,
    timeInSeconds: 30,
    distance: 0,
    units: "",
  });
  await detail.save();
  detail = new Details({
    _id: 6,
    activityId: 4,
    setNumber: 1,
    reps: 10,
    weight: 90,
    timeInSeconds: 0,
    distance: 0,
    units: "Kg",
  });
  await detail.save();
  detail = new Details({
    _id: 7,
    activityId: 4,
    setNumber: 2,
    reps: 10,
    weight: 90,
    timeInSeconds: 0,
    distance: 0,
    units: "Kg",
  });
  await detail.save();
  detail = new Details({
    _id: 8,
    activityId: 5,
    setNumber: 1,
    reps: 0,
    weight: 0,
    timeInSeconds: 0,
    distance: 10,
    units: "Yards",
  });
  await detail.save();
  detail = new Details({
    _id: 9,
    activityId: 6,
    setNumber: 1,
    reps: 0,
    weight: 0,
    timeInSeconds: 0,
    distance: 20,
    units: "Yards",
  });
  await detail.save();
  detail = new Details({
    _id: 10,
    activityId: 7,
    setNumber: 1,
    reps: 12,
    weight: 225,
    timeInSeconds: 0,
    distance: 0,
    units: "Pounds",
  });
  await detail.save();
  detail = new Details({
    _id: 11,
    activityId: 7,
    setNumber: 2,
    reps: 12,
    weight: 225,
    timeInSeconds: 0,
    distance: 0,
    units: "Pounds",
  });
  await detail.save();
  detail = new Details({
    _id: 12,
    activityId: 8,
    setNumber: 1,
    reps: 24,
    weight: 25,
    timeInSeconds: 0,
    distance: 0,
    units: "Pounds",
  });
  await detail.save();
  detail = new Details({
    _id: 13,
    activityId: 8,
    setNumber: 2,
    reps: 24,
    weight: 25,
    timeInSeconds: 0,
    distance: 0,
    units: "Pounds",
  });
  await detail.save();
  detail = new Details({
    _id: 14,
    activityId: 9,
    setNumber: 1,
    reps: 0,
    weight: 0,
    timeInSeconds: 1876,
    distance: 3,
    units: "Kilometers",
  });
  await detail.save();
  detail = new Details({
    _id: 15,
    activityId: 10,
    setNumber: 1,
    reps: 14,
    weight: 145,
    timeInSeconds: 0,
    distance: 0,
    units: "Pounds",
  });
  await detail.save();
  detail = new Details({
    _id: 16,
    activityId: 10,
    setNumber: 2,
    reps: 14,
    weight: 145,
    timeInSeconds: 0,
    distance: 0,
    units: "Pounds",
  });
  await detail.save();
  detail = new Details({
    _id: 17,
    activityId: 11,
    setNumber: 1,
    reps: 26,
    weight: 14,
    timeInSeconds: 0,
    distance: 0,
    units: "Pounds",
  });
  await detail.save();
  detail = new Details({
    _id: 18,
    activityId: 12,
    setNumber: 2,
    reps: 14,
    weight: 145,
    timeInSeconds: 0,
    distance: 0,
    units: "Kilograms",
  });
  await detail.save();
  detail = new Details({
    _id: 19,
    activityId: 13,
    setNumber: 1,
    reps: 0,
    weight: 0,
    timeInSeconds: 0,
    distance: 10,
    units: "Yards",
  });
  await detail.save();
  console.log("Details Saved");
}
async function makeDbs() {
  await saveUsers();
  await saveStats();
  await saveLogs();
  await saveActivities();
  await saveDetails();
  console.log("projectPAT database has been created!");
  process.exit(1); //Make sure everything saves then exit the js program
}
makeDbs();
