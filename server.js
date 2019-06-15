// require("dotenv").config();
// var express = require("express");
// var exphbs = require("express-handlebars");

// var db = require("./models");

// var app = express();
// var PORT = process.env.PORT || 3000;

// // Middleware
// app.use(express.urlencoded({ extended: false }));
// app.use(express.json());
// app.use(express.static("public"));
// app.use(express.static("views"));
// // Handlebars
// app.engine(
//     "handlebars",
//     exphbs({
//         defaultLayout: "main"
//     })
// );
// app.set("view engine", "handlebars"); 7

var cheerio = require("cheerio");
var axios = require("axios");

// Making a request via axios for `nhl.com`'s homepage
axios.get("https://kutv.com/news/local").then(function (response) {

    // Load the body of the HTML into cheerio
    var $ = cheerio.load(response.data);

    // Empty array to save our scraped data
    var results = [];

    // With cheerio, find each h4-tag with the class "headline-link" and loop through the results
    $("p.teaser-title").each(function (i, element) {

        // Save the text of the h4-tag as "title"
        var title = $(element).text();

        // Find the h4 tag's parent a-tag, and save it's href value as "link"
        var link = $(element).parent().attr("href");

        // Make an object with data we scraped for this h4 and push it to the results array
        results.push({
            title: title,
            link: link
        });
    });

    // After looping through each h4.headline-link, log the results
    console.log(results);
});
