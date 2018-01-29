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

if (process.env.NODE_ENV || "dev" == "dev") {
	mongoose.connect("mongodb://localhost/newsArticleScraper", {
	useMongoClient: true
})} else {
	mongoose.connect("mongodb://<dbuser>:<dbpassword>@ds117878.mlab.com:17878/heroku_xmb8sn12", {
	useMongoClient: true
})};

//set handlebars.
var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//get route for scraping the New York Times home page
app.get("/scrape", function (req, res) {
	//get the body of the html
	axios.get("https://www.nytimes.com/").then(function (results) {
		//load the results into cheerio
		var $ = cheerio.load(results.data);
		//get the h2 within each article tag
		$("article").each(function (i, element) {
			//empty object to store the article information
			var article = {};
			//save the NYT articles' titles and links into the article object
			article.title = $(this).children("h2").children("a").text();
			article.link = $(this).children("h2").children("a").attr("href");
			article.summary = $(this).children("p").text();
			//create a new Article model using the article object created from the scrape
			//if statement fixes issue with article tag sometimes returning empty info
			if (article.title !== "") {
				db.Article
				.create(article)
				.then(function (dbArticle) {
					//if the scrape is successful, send this message
					res.send("Scrape sucessful!")
				})
				.catch(function (error) {
					//if error, send the error
					res.json(error);
				});
			}
		});
	});
});

//get route for getting the articles from the database
app.get("/", function (req, res) {
	//get all the articles stored in Articles collection
	db.Article
		.find({})
		.then(function (dbArticle) {
			//create an object to render into handlebars
			var articlesObject = {
				articles: dbArticle
			}
			//send the stored articles to the client
			res.render("index", articlesObject);
		})
		.catch(function (error) {
			//if error occurs, send the error to the client
			res.json(error);
		});
});

//start the server on port 3000
app.listen(PORT, function() {
	console.log("App is running on port " + PORT + ".");
});