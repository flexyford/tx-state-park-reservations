var express = require('express');
// var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

app.get('/scrape', function(req, res){

  let campId = 79; // Enchanted Rock State Natural Area
  let today = '2/6/2017';
  let url = `http://texas.reserveworld.com/GeneralAvailabilityCalendar.aspx`;
  let query = `?campId=${campId}&arrivalDate=${today}`;

  request(url + query, function(error, response, html){
    if(!error){
      var $ = cheerio.load(html);

      var title, release, rating;
      var json = { };

      // We'll use the unique table
      let $table = $('table[summary]');
      console.log("$table = ", $table.text());
    }
  });

});

app.listen('8081');

console.log('http://localhost:8081/scrape');

exports = module.exports = app;
