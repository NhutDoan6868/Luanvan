const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const hostname = "localhost";

app.set("views", path.join(__dirname, "./src/views"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.get("/nani", (req, res) => {
  res.render("sample.ejs");
});

app.listen(port, hostname, () => {
  console.log(`Example app listening on port ${port}`);
});
