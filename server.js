var express = require('express');
// var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

const PARKS = {
  /* "PARK NAME": CAMP_ID */
  "ABILENE SP": 219,
  "ATLANTA SP": 110,
  "BALMORHEA SP": 164,
  "BARTON WARNOCK VISITOR CENTER": null,
  "BASTROP SP": 180,
  "BATTLESHIP TEXAS SHS": null,
  "BENTSEN RIO GRANDE SP": null,
  "BIG BEND RANCH SP": null,
  "BIG SPRING SP": null,
  "BLANCO SP": 1,
  "BONHAM SP": 4,
  "BRAZOS BEND SP": 50,
  "BUESCHER SP": 31,
  "BUESCHER SP (LAKEVIEW)": 6851,
  "CADDO LAKE SP": 19,
  "CAPROCK CANYONS SP": 217,
  "CEDAR HILL SP": 112,
  "CHOKE CANYON SP": 13,
  "CLEBURNE SP": 145,
  "COLORADO BEND SP": 169,
  "COOPER LAKE SP DOCTORS CREEK": 39,
  "COOPER LAKE SP SOUTH SULPHUR": 36,
  "COPPER BREAKS SP": 67,
  "DAINGERFIELD SP": 12,
  "DAVIS MOUNTAINS SP": 90,
  "DEVILS RIVER SNA": null,
  "DEVILS SINKHOLE SNA": null,
  "DINOSAUR VALLEY SP": 13,
  "EISENHOWER SP": 61,
  "ENCHANTED ROCK SNA": 79,
  "ESTERO LLANO GRANDE SP": null,
  "FAIRFIELD LAKE SP": 185,
  "FALCON SP": 187,
  "FANTHORP INN SHS": null,
  "FORT BOGGY SP": null,
  "FORT LEATON SHS": null,
  "FORT PARKER SP": 56,
  "FORT RICHARDSON SP AND SHS": 160,
  "FRANKLIN MOUNTAINS SP": null,
  "GALVESTON ISLAND SP": 5703,
  "GARNER SP": 156,
  "GOLIAD SP": 22,
  "GOOSE ISLAND SP": 190,
  "GOVERNMENT CANYON SNA": 99,
  "GUADALUPE RIVER SP": 7,
  "HILL COUNTRY SNA": 88,
  "HUECO TANKS SP AND SHS": null,
  "HUNTSVILLE SP": 117,
  "INDIAN LODGE": null,
  "INKS LAKE SP": 102,
  "KICKAPOO CAVERN SP": 5810,
  "LK ARROWHEAD SP": 75,
  "LK BOB SANDLIN SP": 223,
  "LK BROWNWOOD SP": 194,
  "LK CASA BLANCA INTERNATIONAL SP": 29,
  "LK COLORADO CITY SP": 114,
  "LK CORPUS CHRISTI SP": 47,
  "LK LIVINGSTON SP": 136,
  "LK LIVINGSTON SP (PINEY SHORES & RED OAK)": 6651,
  "LK MINERAL WELLS SP": 85,
  "LK SOMERVILLE SP BIRCH CREEK": 172,
  "LK SOMERVILLE SP NAILS CREEK": null,
  "LK TAWAKONI SP": 167,
  "LK WHITNEY SP": 42,
  "LOCKHART SP": 9,
  "LOST MAPLES SNA": 95,
  "LYNDON B. JOHNSON SP AND SHS": null,
  "MARTIN CREEK LAKE SP": 129,
  "MARTIN DIES JR. SP": 132,
  "MCKINNEY FALLS SP": 25,
  "MERIDIAN SP": 203,
  "MISSION TEJAS SP": 210,
  "MONAHANS SANDHILLS SP": 226,
  "MONUMENT HILL/KREISCHE BREWERY": null,
  "MOTHER NEFF SP": 120,
  "MUSTANG ISLAND SP": 153,
  "PALMETTO SP": 174,
  "PALO DURO CANYON SP": 208,
  "PEDERNALES FALLS SP": 77,
  "POSSUM KINGDOM SP": 82,
  "PURTIS CREEK SP": 54,
  "RAY ROBERTS LK SP ISLE DU BOIS": 96,
  "RAY ROBERTS LK SP JOHNSON BRANCH": 83,
  "RESACA DE LA PALMA SP": null,
  "SAN ANGELO SP": 141,
  "SAN JACINTO BATTLEGROUND SHS": null,
  "SEA RIM SP": 5971,
  "SEMINOLE CANYON SP AND SHS": 163,
  "SHELDON LAKE SP": null,
  "SOUTH LLANO RIVER SP": 171,
  "STEPHEN F. AUSTIN SP": 198,
  "TYLER SP": 70,
  "VILLAGE CREEK SP": 214,
  "WASHINGTON ON THE BRAZOS SHS": null,
  "WYLER AERIAL TRAMWAY": null
};

const url = `http://texas.reserveworld.com/GeneralAvailabilityCalendar.aspx`;

let parks = {};

Object.keys(PARKS).filter((park) => PARKS[park]).forEach((park, index) => {
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

      let $data = $rows.slice(2);

      current.sites = $data.map(function() {
        return $(this).find('td').eq(0).text();
      }).toArray();

      let $headers = $rows.eq(1).find('td');
      let $dates = $headers.slice(5); // 5 is the Index of Dates

      $dates.each(function(index) {
        let date = $(this).text();
        let offset = index + 5;
        current.dates[date] = {};

        current.sites.forEach((site, index) => {
          let $row = $data.eq(index);
          let available = $row.find('td').eq(offset).text();
          // console.log(`${park} has ${available} spots available on ${date} at ${site} site`);
          current.dates[date][site] = available;
        });
      });

      // console.log(`${park} = `, current);
    }
  });
});

exports = module.exports = app;
