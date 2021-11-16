const express = require("express");

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
