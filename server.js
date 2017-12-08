//require the npm packages this app will need to run
var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var cheerio = require("cheerio");
var axios = require("axios");
//require the models folder
var db = require("./models");

var PORT = 3000;
//initialize Express
var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
//use express.static to serve the public folder as a static directory
app.use(express.static("public"));
//use ES6 promises in mongoose
mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/newsArticleScraper", {
	useMongoClient: true
});
//get route for scraping the New York Times home page
app.get("/scrape", function (req, res) {
	//get the body of the html
	axios.get("https://www.nytimes.com/").then(function (results) {

		var $ = cheerio.load(results.data);

		$("article h2").each(function (i, element) {

			var article = {};

			article.title = $(this).children("a").text();

			article.link = $(this).children("a").attr("href");

			console.log(article);
		});
	});
});




app.listen(PORT, function() {
	console.log("App is running on port " + PORT + ".");
});