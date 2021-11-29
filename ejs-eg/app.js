const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
require("dotenv").config();
//mongoose connection
mongoose.connect("mongodb://localhost:27017/projectPAT");
//------Collections------
const Users = require("./Models/user");
const UserStats = require("./Models/stats");
const Activities = require("./Models/activity");
const Logs = require("./Models/logs");
const Details = require("./Models/details");
const { removeAllListeners } = require("nodemon");
// this is a canonical alias to make your life easier, like jQuery to $.
const app = express();
// host static resources
app.use(express.static("Public"));
// body-parser is now built into express!
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
//Session and passport initialization
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
//Code from stackoverflow at the following link: https://stackoverflow.com/questions/1531093/how-do-i-get-the-current-date-in-javascript?rq=1
var today = new Date();
var dd = String(today.getDate()).padStart(2, "0");
var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
var yyyy = today.getFullYear();

today = yyyy + "-" + mm + "-" + dd;
// a common localhost test port
const port = 3000;

// Simple server operation
app.listen(port, () => {
  // template literal
  console.log(`Server is running on http://localhost:${port}`);
});
//Function that gets the next id of a given collection
async function getNextId(collection) {
  var nextAvailValidId = 0;
  let taskIds = await collection.find().distinct("_id");
  taskIds.forEach((idNum) => {
    if (parseInt(idNum) >= nextAvailValidId) {
      nextAvailValidId = parseInt(idNum) + 1;
    }
  });
  return nextAvailValidId;
}
async function renderLogPage(req, res, usersName, usersId, logsDate) {
  let activsToRender = await Activities.find({ parentLogId: 0 });
  let logId = await Logs.findOne({ ownerId: usersId, date: logsDate });
  if (logId == null || logId == "undefined") {
    console.log(logsDate);
    nextId = await getNextId(Logs);
    logId = new Logs({
      _id: nextId,
      date: logsDate,
      ownerId: usersId,
    });
    await logId.save();
  }
  let loggedActivsToRender = await Activities.find({
    parentLogId: logId._id,
  });
  let activsDetails = [];
  for (activity of loggedActivsToRender) {
    let tempDetails = await Details.find({ activityId: activity._id });
    for (det of tempDetails) {
      activsDetails.push(det);
    }
  }
  res.render("logActivity", {
    username: usersName,
    date: logsDate,
    activsList: activsToRender,
    loggedActivsList: loggedActivsToRender,
    activDetailList: activsDetails,
    logsId: logId._id,
  });
}
app.post("/logActivity", (req, res) => {
  var dateToSearchFor = req.body.selectedDate;
  var currUsersId = req.user._id;
  if (dateToSearchFor != null && dateToSearchFor != "undefined") {
    renderLogPage(req, res, req.user.username, currUsersId, dateToSearchFor);
  } else {
    renderLogPage(req, res, req.user.username, currUsersId, today);
  }
});
app.post("/addAnotherActivity", async (req, res) => {
  //the current logs information and add a blank detail to the log
  var usersName = req.user.username;
  var usersId = req.user._id;
  var date = req.body.DateForLog;
  var newActivsId = await getNextId(Activities);
  var logsId = req.body.CurrLogsId;
  const newActivity = new Activities({
    _id: newActivsId,
    parentLogId: logsId,
    activityName: null,
    activityType: null,
  });
  newActivity.save().then(() => {
    renderLogPage(req, res, usersName, usersId, date);
  });
});
app.post("/selectActivity", async (req, res) => {
  var selectedActivityId = req.body.HiddenActivityId;
  var selectedActivityName = req.body.Activity;
  var parentActivity = await Activities.findOne({
    parentlogId: 0,
    activityName: selectedActivityName,
  });
  if (parentActivity != undefined) {
    await Activities.findOneAndUpdate(
      { _id: selectedActivityId },
      {
        activityName: selectedActivityName,
        activityType: parentActivity.activityType,
      }
    );
    var baseDetailId = await getNextId(Details);
    const baseDetail = new Details({
      _id: baseDetailId,
      activityId: selectedActivityId,
      setNumber: 0,
      reps: null,
      weight: null,
      timeInSeconds: null,
      distance: null,
      units: null,
    });
    baseDetail.save().then(() => {
      renderLogPage(
        req,
        res,
        req.user.username,
        req.user._id,
        req.body.DateForLog
      );
    });
  } else if ((selectedActivityName = "newActivity")) {
    var newActivsId = await getNextId(Activities);
    newActivity = new Activities({
      _id: newActivsId,
      parentLogId: 0,
      activityName: "new activity being made",
      activityType: "no",
    });
    await newActivity.save();
    var usersId = req.user._id;
    var usersPersonalActivityId = await getNextId(Activities);
    let logId = await Logs.find({
      ownerId: usersId,
      date: req.body.DateForLog,
    });
    newActivity = new Activities({
      _id: usersPersonalActivityId,
      parentLogId: logId[0]._id,
      activityName: "new activity being made",
      activityType: "no",
    });
    newActivity.save().then(() => {
      renderLogPage(
        req,
        res,
        req.user.username,
        req.user._id,
        req.body.DateForLog
      );
    });
  }
});
app.post("/editActivityDetails", async (req, res) => {
  var newSeconds = parseFloat(req.body.Seconds) + parseInt(60 * req.body.Min);
  var newDistance = req.body.Distance;
  var newUnits = req.body.Units;
  if (!isNaN(newSeconds) && !isNaN(newDistance)) {
    await Details.findOneAndUpdate(
      { _id: req.body.detailId },
      { timeInSeconds: newSeconds, distance: newDistance, units: newUnits }
    );
  } else if (!isNaN(req.body.Reps) || !isNaN(req.body.Weight)) {
    await Details.findOneAndUpdate(
      { _id: req.body.detailId },
      { reps: req.body.Reps, weight: req.body.Weight, units: newUnits }
    );
  } else if (!isNaN(newSeconds) || isNaN(newDistance)) {
    await Details.findOneAndUpdate(
      { _id: req.body.detailId },
      { timeInSeconds: newSeconds }
    );
  } else if (isNaN(newSeconds) || !isNaN(newDistance)) {
    await Details.findOneAndUpdate(
      { _id: req.body.detailId },
      { distance: newDistance, units: newUnits }
    );
  }
  renderLogPage(req, res, req.user.username, req.user._id, req.body.DateForLog);
});
app.post("/editNewActivity", async (req, res) => {
  var newName = req.body.newActivityName;
  var newType = req.body.newActivityType;
  var newId = req.body.newActivityId;
  if (newName != null && newType != null) {
    await Activities.findOneAndUpdate(
      { _id: newId },
      { activityName: newName, activityType: newType }
    );
    var nextDetailId = await getNextId(Details);
    newDetail = new Details({
      _id: nextDetailId,
      activityId: newId,
      setNumber: 1,
      reps: null,
      weight: null,
      timeInSeconds: null,
      distance: null,
      units: null,
    });
    await newDetail.save();
    Activities.findOneAndUpdate(
      { activityType: "no" },
      { activityName: newName, activityType: newType }
    ).then(() => {
      renderLogPage(
        req,
        res,
        req.user.username,
        req.user.username,
        req.body.DateForLog
      );
    });
  }
});
app.post("/addSet", async (req, res) => {
  var parentId = req.body.parentActivity;
  var date = req.body.DateForLog;
  var nextId = await getNextId(Details);
  let currDetails = await Details.find({ activityId: parentId });
  newDetail = new Details({
    _id: nextId,
    activityId: parentId,
    setNumber: parseInt(currDetails.length) + 1,
    reps: null,
    weight: null,
    timeInSeconds: null,
    distance: null,
    units: null,
  });
  newDetail.save().then(() => {
    renderLogPage(req, res, req.user.username, req.user._id, date);
  });
});
app.post("/removeSet", async (req, res) => {
  var parentId = req.body.parentActivity;
  var date = req.body.DateForLog;
  let currDetails = await Details.find({ activityId: parentId });
  Details.findOneAndRemove({
    activityId: parentId,
    setNumber: parseInt(currDetails.length),
  }).then(() => {
    renderLogPage(req, res, req.user.username, req.user._id, date);
  });
});
app.post("/removeActivity", async (req, res) => {
  var usersName = req.user.username;
  var usersId = req.user._id;
  var activityId = req.body.ActivityToRemove;
  Activities.findOneAndRemove({ _id: activityId }).then(() => {
    renderLogPage(req, res, usersName, usersId, req.body.DateForLog);
  });
});
app.post("/loginPage", (req, res) => {
  res.render("login");
});
app.post("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

app.get("/", (req, res) => {
  renderLoginPage(req, res, "");
});
function renderLoginPage(req, res, signupMessage) {
  res.render("../Public/index", {
    signupMessage: signupMessage,
  });
}

function renderHomePage(req, res, username) {
  res.render("home", {
    username: username,
  });
}
app.post("/home", (req, res) => {
  renderHomePage(req, res, req.user.username);
});

app.post("/login", (req, res) => {
  const user = new Users({
    username: req.body.username,
    password: req.body.password,
  });
  req.login(user, (err) => {
    if (err) {
      console.log(err);
      res.redirect("/");
    } else {
      passport.authenticate("local")(req, res, () => {
        renderHomePage(req, res, req.user.username);
      });
    }
  });
});

app.post("/register", async (req, res) => {
  var newId = await getNextId(Users);
  var newStatsId = await getNextId(UserStats);
  Users.register(
    {
      _id: newId,
      email: req.body.SignupEmail,
      username: req.body.SignupUsername,
    },
    req.body.SignupPassword,
    (err, user) => {
      if (err) {
        console.log(err);
        res.redirect("/");
      } else {
        passport.authenticate("local");
        var usersStats = new UserStats({
          _id: newStatsId,
          userId: newId,
          name: "Insert your stats here!",
          startingPoint: -1,
          currentPoint: -1,
          endPoint: -1,
          units: "Stats",
        });
        usersStats.save();
        renderLoginPage(req, res, "Signup complete, please log in!");
      }
    }
  );
});

async function renderStatsPage(
  req,
  res,
  username,
  usersId,
  statsState,
  goalsState
) {
  let stats = await UserStats.find({ userId: usersId, startingPoint: -1 });
  let goals = await UserStats.find({
    userId: usersId,
    startingPoint: { $gt: 0 },
  });
  //console.log("goals:"+goals);
  res.render("currentStats", {
    username: username,
    Stats: stats[0].name,
    goalList: goals,
    statsState: statsState,
    goalsState: goalsState,
  });
}

app.post("/currentStats", (req, res) => {
  renderStatsPage(
    req,
    res,
    req.user.username,
    req.user._id,
    "statsReady",
    "goalsReady"
  );
});

app.post("/editStats", (req, res) => {
  renderStatsPage(
    req,
    res,
    req.user.username,
    req.user._id,
    "statsEdit",
    "goalsReady"
  );
});
app.post("/saveStats", async (req, res) => {
  var textStats = req.body.textBoxStats;
  var usersId = req.user._id;
  await UserStats.findOneAndUpdate(
    { userId: usersId, startingPoint: -1 },
    { name: textStats }
  );
  renderStatsPage(
    req,
    res,
    req.user.username,
    req.user._id,
    "statsReady",
    "goalsReady"
  );
});

app.post("/editGoals", (req, res) => {
  renderStatsPage(
    req,
    res,
    req.user.username,
    req.user._id,
    "statsReady",
    "goalsEdit"
  );
});
app.post("/saveGoals", async (req, res) => {
  var usersId = req.user._id;
  var goals = await UserStats.find({
    userId: usersId,
    startingPoint: { $gt: 0 },
  });
  for (element of goals) {
    var idValue = element._id;
    var newName = req.body["goal" + idValue];
    var newStarting = req.body["starting" + idValue];
    var newCurrent = req.body["current" + idValue];
    var newEnd = req.body["end" + idValue];
    var newUnits = req.body["units" + idValue];
    await UserStats.findOneAndUpdate(
      { _id: idValue, userId: usersId },
      {
        name: newName,
        startingPoint: newStarting,
        currentPoint: newCurrent,
        endPoint: newEnd,
        units: newUnits,
      }
    );
  }
  renderStatsPage(
    req,
    res,
    req.user.username,
    req.user._id,
    "statsReady",
    "goalsReady"
  );
});
app.post("/addGoal", async (req, res) => {
  var newId = await getNextId(UserStats);
  var usersId = req.user._id;
  var usersStats = new UserStats({
    _id: newId,
    userId: usersId,
    name: "NEW GOAL THAT WAS ADDED",
    startingPoint: 1,
    currentPoint: 1,
    endPoint: 1,
    units: "",
  });
  await usersStats.save();
  renderStatsPage(
    req,
    res,
    req.user.username,
    req.user._id,
    "statsReady",
    "goalsEdit"
  );
});
