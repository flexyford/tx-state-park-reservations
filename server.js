var express = require('express');
// var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

const PARKS = {
  'McKinney Falls': 25,
  'Enchanted Rock': 79
};

const url = `http://texas.reserveworld.com/GeneralAvailabilityCalendar.aspx`;

let parks = {};

Object.keys(PARKS).forEach((park) => {
  let campId = PARKS[park];
  let date = '2/6/2017';
  let query = `?campId=${campId}&arrivalDate=${date}`;

  // Initialize new park
  parks[park] = { dates: {} };

  let current = parks[park];

  request(url + query, function(error, response, html){
    if(!error){
      var $ = cheerio.load(html);

      var json = { };

      // We'll use the unique table
      let $table = $('table[summary]');
      let $rows = $table.find('tr');

      let $headers = $rows.eq(1).find('td');
      let $dates = $headers.slice(5); // 5 is the Index of Dates

      let $data = $rows.slice(2);

      let sites = $data.map(function() {
        return $(this).find('td').eq(0).text();
      }).toArray();

      current.sites = sites;

      $dates.each(function(index) {
        let date = $(this).text();
        let offset = index + 5;
        current.dates[date] = {};

        sites.forEach((site, index) => {
          let $row = $data.eq(index);
          // console.log("$row = ", $row);
          let available = $row.find('td').eq(offset).text();
          // console.log(`${park} has ${available} spots available on ${date} at ${site} site`);
          current.dates[date][site] = available;
        });
      });

      // console.log('parks = ', parks);
    }
  });
});

exports = module.exports = app;
