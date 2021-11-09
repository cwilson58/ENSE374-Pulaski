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

app.post("/logActivity", (req, res) => {
  res.render("logActivity", {
    username: "TESTNAME",
    date: "SOMEDATE",
  });
});
