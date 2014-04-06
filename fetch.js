//process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var request = require('request');
//var r = request.defaults({'proxy': 'http://localhost:8888'});
var r = request.defaults();

var TEXTSEARCH = 'textsearch';
var NEARBYSEACH = 'nearbysearch';
var BY_PROMINENCE = 'prominence';
var BY_DISTANCE = 'distance';

function fetch(keyword, location, searchtype, rankby, done, pagetoken) {
	rankby = rankby || 'prominence';
	var url = 'https://maps.googleapis.com/maps/api/place/' + searchtype + '/json?key=AIzaSyCcm5xQkYpSMXR3uWm4kdQlc92VHjtTts4&location=' + location + '&sensor=false';
	if (searchtype == 'nearbysearch') {
		url += '&keyword=' + keyword + '&rankby=' + rankby;
		if (rankby != 'distance') {
			url += '&radius=50000';
		}
	} else {
		url += '&query=' + keyword + '&radius=50000';
	}
	if (pagetoken) {
		url += '&pagetoken=' + pagetoken;
	}
	console.error('Fetching ' + url);
 	r.get(url, function (error, res, body) {
		var obj = JSON.parse(body);
		if (obj.status == 'INVALID_REQUEST') {
			console.error('INVALID_REQUEST');
		} else {
			var results = obj.results;
			results.forEach(function (result) {
				result._id = result.id;
				delete result.id;
			});

			if (obj.next_page_token) {
				setTimeout(function () {
					fetch(keyword, location, searchtype, rankby, function (results2) {
						results = results.concat(results2);
						done(results);
					}, obj.next_page_token);
				}, 2000);

			} else {
				done(results)
			}
		}
	});
}

function multifetch(keyword, location) {
	var results = [];
	fetch(keyword, location, NEARBYSEACH, BY_PROMINENCE, function (r1) {
		results = results.concat(r1);
		fetch(keyword, location, NEARBYSEACH, BY_DISTANCE, function (r2) {
			results = results.concat(r2);
			fetch(keyword, location, TEXTSEARCH, '', function (r3) {
				results = results.concat(r3);
				console.log(JSON.stringify(results));
			});
		});
	});
}

var starleyWay = '52.43006,-1.714554';
var coventry = '52.406817,-1.519718';

multifetch('software', coventry);

//c/mongodb-win32-x86_64-2008plus-2.4.10/bin/mongoimport --db test --jsonArray --collection jobs --file jobs.json
