var express = require("express");
var request = require("request");
var rp = require("request-promise");

var app = express();

app.use(express.static("public"));

var mainURL = "http://www.omdbapi.com/?";
var set = "&apikey=";
var apikey = null;

app.set("view engine", "ejs");

//TODO: extend this function to get multiple pages
app.get("/results", function(req, res) {
  var query = req.query.search;
  var url = mainURL + "s=";
  request(url + query + set + apikey, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      var data = JSON.parse(body);
      if (data.Response.toLowerCase() === "false") {
        res.render("not-found", {title: "Try Google"});
      } else {
          var dump = [];
          for (var i = 0; i < data.Search.length; i++) {
            var getSome = {
              method: "GET",
              uri: mainURL + "i=" + data.Search[i].imdbID + set + apikey,
              json: true
            };
            dump.push(rp(getSome));
          }
          Promise.all(dump)
            .then((details) => {
              res.render("results", {data: data, title: "Results", details: details});
            }).catch(err => console.log(err));
      }
    } else {
      res.send("something went wrong on our side...");
      console.log(error);
    }
  });
});

app.get("/", function(req, res) {
  if (apikey === null) {
    res.send("please set the api key from omdbapi.com");
  } else {
    res.render("search", {title: "MSE"});
  }
});

app.listen(3000, function() {
  console.log("serving at http://localhost:3000");
});
