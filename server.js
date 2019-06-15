var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var cheerio = require("cheerio");
var axios = require("axios");
var mongojs = require("mongojs");

var app = express();
var databaseURL = "scraperdb";
var collections = ["scrapedData"];

var db = mongojs(databaseURL, collections);
db.on("error", function (error) {
    console.log("Database Error:", error);
});

app.get("/", function (req, res) {
    db.scrapedData.find({}, function (error, found) {
        if (error) {
            console.log(error);
        }
        else {
            res.json(found);
        }

    });
});


app.get("/scrape", function (req, res) {
    // Making a request via axios for `nhl.com`'s homepage
    axios.get("https://kutv.com/news/local").then(function (response) {

        // Load the body of the HTML into cheerio
        var $ = cheerio.load(response.data);

        // Empty array to save our scraped data
        // var results = [];

        // With cheerio, find each h4-tag with the class "headline-link" and loop through the results
        $("p.teaser-title").each(function (i, element) {

            // Save the text of the h4-tag as "title"
            var title = $(element).text();

            // Find the h4 tag's parent a-tag, and save it's href value as "link"
            var link = $(element).parent().attr("href");

            if (title && link) {
                db.scrapedData.insert({
                    title: title,
                    link: link
                },
                    function (err, inserted) {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            console.log(inserted);
                        }
                    });
            }
        });
    });
    // Make an object with data we scraped for this h4 and push it to the results array
    // results.push({
    //     title: title,
    //     link: link
    // });
    res.send("Scrape Complete");
});

app.listen(3000, function () {
    console.log("app running on 3000");
});

// After looping through each h4.headline-link, log the results


