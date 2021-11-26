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
// this is a canonical alias to make your life easier, like jQuery to $.
const app = express();
// host static resources
app.use(express.static("Public"));
// body-parser is now built into express!
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
//Session and passport initialization
app.use(session({secret:process.env.SECRET, resave:false, saveUninitialized:false}));
app.use (passport.initialize());
app.use (passport.session());
//Code from stackoverflow at the following link: https://stackoverflow.com/questions/1531093/how-do-i-get-the-current-date-in-javascript?rq=1
var today = new Date();
var dd = String(today.getDate()).padStart(2, "0");
var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
var yyyy = today.getFullYear();

today = mm + "-" + dd + "-" + yyyy;
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
async function RenderLogPage(req, res, usersName, usersId, logsDate) {
  let activsToRender = await Activities.find({ parentLogId: 0 });
  let logId = await Logs.find({ ownerId: usersId, date: logsDate });
  let loggedActivsToRender = await Activities.find({
    parentLogId: logId[0]._id,
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
    logsId: logId[0]._id,
  });
}
app.post("/logActivity", (req, res) => {
  RenderLogPage(req, res, "CameronTestUser", 0, "2021-12-22");
});
app.post("/addAnotherActivity", async (req, res) => {
  //the current logs information and add a blank detail to the log
  var usersName = "CameronTestUser";
  var usersId = 0;
  var date = "2021-12-22";
  var newActivsId = await getNextId(Activities);
  var logsId = req.body.CurrLogsId;
  const newActivity = new Activities({
    _id: newActivsId,
    parentLogId: logsId,
    activityName: null,
    activityType: null,
  });
  newActivity.save().then(() => {
    console.log("AN ACTIVITY HAS BEEN ADDED for log " + logsId);
    RenderLogPage(req, res, usersName, usersId, date);
  });
  console.log("ADD");
});
app.post("/home", (req, res) => {
  res.redirect("/");
});

app.post("/loginPage", (req, res) => {
  res.render("login");
});
app.post("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

app.post("/currentStats", (req, res) => {
  res.render("currentStats", {
    username: "TESTNAME",
  });
});
app.get("/", (req, res) => {
  res.render("../Public/index");
});

function renderHomePage(req,res, username)
{
  res.render("home", {
    username: username,
  });
}

app.post("/login", (req, res) => {
    const user = new Users ({
        username: req.body.username,
        password: req.body.password
    });
    req.login ( user, ( err ) => {
        if ( err ) {
          console.log( err );
          res.redirect( "/" );
        } 
        else {
          passport.authenticate( "local" )( req, res, () => {
            renderHomePage(req,res,req.user.username);
          });
        }
    });
});

app.post("/register", async (req, res) => {
  var newId = await getNextId(Users);
  Users.register({ _id:newId , email:req.body.SignupEmail , username:req.body.SignupUsername }, req.body.SignupPassword,
                    ( err, user ) => {
        if ( err ) {
        console.log( err );
            res.redirect( "/" );
        }
        else {
          passport.authenticate( "local");
          renderHomePage(req,res, req.body.SignupUsername);
        }
    });
});