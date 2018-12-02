var express = require("express");
var app = express();
var request = require("request");

var apikey = null;

app.set("view engine", "ejs");

app.get("/results", function(req, res) {
  var query = req.query.search;
  var url = "http://www.omdbapi.com/?s=";
  request(url + query + apikey, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      var data = JSON.parse(body);
      res.render("results", {data: data});
    } else {
      res.send("something went wrong...");
      console.log(error);
    }
  });
});

app.get("/", function(req, res) {
  if (apikey === null) {
    res.send("please set the api key from omdbapi.com");
  } else {
    res.render("search");
  }
});

app.listen(3000, function() {
  console.log("serving at http://localhost:3000");
});