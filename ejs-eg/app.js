const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
require("dotenv").config();
//schemas
const userSchema = new mongoose.Schema({
  _id: Number,
  username: String,
  password: String,
});
userSchema.plugin(passportLocalMongoose);
//collections
const Users = new mongoose.model("User", userSchema);
// this is a canonical alias to make your life easier, like jQuery to $.
const app = express();
// host static resources
app.use(express.static("Public"));
// body-parser is now built into express!
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// a common localhost test port
const port = 3000;

// Simple server operation
app.listen(port, () => {
  // template literal
  console.log(`Server is running on http://localhost:${port}`);
});
//Function that gets the next id of a given collection
function getNextId(collection) {}
// Testing the log page, needs to be modified to actually render the page
app.post("/logActivity", (req, res) => {
  res.render("logActivity", {
    username: "TESTNAME",
    date: "SOMEDATE",
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
