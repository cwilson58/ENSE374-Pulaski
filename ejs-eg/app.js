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
//Code from stackoverflow at the following link: https://stackoverflow.com/questions/1531093/how-do-i-get-the-current-date-in-javascript?rq=1
var today = new Date();
var dd = String(today.getDate()).padStart(2, "0");
var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
var yyyy = today.getFullYear();

today = mm + "/" + dd + "/" + yyyy;
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
  console.log(nextAvailValidId);
  return nextAvailValidId;
}
// Testing the log page, needs to be modified to actually render the page
app.post("/logActivity", (req, res) => {
  res.render("logActivity", {
    username: "TESTNAME",
    date: today,
  });
});
app.post("/home", (req, res) => {
  res.redirect("/");
});

app.post("/loginPage", (req, res) => {
  res.sendFile(__dirname + "/views/login.html");
});
app.post("/logout", (req, res) => {
  res.redirect("/");
});

app.post("/currentStats", (req, res) => {
  res.render("currentStats", {
    username: "TESTNAME",
  });
});
