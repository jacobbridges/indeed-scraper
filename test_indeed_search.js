/**
 * Search Indeed
 */

var request = require('request'),
    cheerio = require('cheerio'),
    colors  = require('colors'),
    _       = require('lodash');

// Payload to send with request
var payload = {
	as_and : 'node', // With all of these words
	as_phr : '',     // With the exact phrase
	as_any : '',     // With at least one of these words
	as_not : '',     // With none of these words
	as_ttl : '',     // With these words in the title
	as_cmp : '',     // From this company
	jt : 'all',
	st : '',
	salary : '',
	radius : '25',
	l : 'Philadelphia, PA',
	fromage : 'any',
	limit : '10',
	sort : '',
	psf : 'advsrch'
}

var urlParams = '';

//_(payload).each(function(value, key) {
//	urlParams += encodeURIComponent(key) + '=' + encodeURIComponent(value) + '&';
//});

console.log();
console.log('Searching with keywords "%s" within %s miles of %s'.yellow, payload.as_and, payload.radius, payload.l);

request.get({
	url :'http://www.indeed.com/jobs?',
	qs : payload,
	jar : true
	},
	function (error, response, html) {

		if (!error) {

			console.log('On the search results page.'.green);
			// Load the html into cheerio
			$ = cheerio.load(html);

			if ($('#searchCount').html() !== null)
				console.log( $('#searchCount').text().match(/(\d)+/g)[2] );
			else {
				console.log('Error: Search count not found.'.red);
				console.log();
			}
	  	}

	  	else
	  		console.log(error);
	}
);

