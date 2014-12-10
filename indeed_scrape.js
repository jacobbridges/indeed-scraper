/**
 * Perform an advanced search on indeed
 */

process.env.TZ = 'America/New_York' 

var request = require('request'),
	MongoC  = require('mongodb').MongoClient
    assert  = require('assert'),
    moment  = require('moment-timezone'),
    cheerio = require('cheerio'),
    colors  = require('colors'),
    _       = require('lodash');

// URL to mongo database
var mongo_url = 'mongodb://localhost:27017/scraped';

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

var job_search_url = 'http://www.indeed.com/jobs';

console.log();
console.log('------------------------------------------');
console.log('Searching with keywords "%s" within %s miles of %s', payload.as_and, payload.radius, payload.l);

console.log();
console.log(' 1. Making search request to indeed.com'.yellow);

request.get({
	url : job_search_url,
	qs : payload,
	jar : true
	},
	function (error, response, html) {

		if (!error) {

			console.log('    Request returned no errors!'.green);

			console.log(' 2. Scraping the results page for the total number of matches to our query'.yellow);
			$ = cheerio.load(html);

			if ($('#searchCount').html() !== null)
			{

				var total = ($('#searchCount').text().match(/(\d)+/g)[2]);
				if (!_.isUndefined( total ) && !_.isNull( total ))
				{
					console.log('    Found the results total!'.green);
					console.log('    - ' + ($('#searchCount').text().match(/(\d)+/g)[2]).blue );
				}
					
				else
				{
					console.log('    Could not find the results total.'.red);
					return;
				}

				// Create a connection to the mongo db and save the scrape
				console.log(' 3. Creating a connection to our MongoDB database'.yellow);
				MongoC.connect(mongo_url, function(err, db) {
					if (!err)
					{
						console.log('    Succefully connected to the database!'.green);
						saveScrape(db, {site:"indeed.com", search:payload, result:total, utc_date:moment().tz("America/New_York").unix().toString()}, function(insertResult){
							db.close();
						});
					}

					else
					{
						console.log('    Could not connect to the database!'.red);
						console.log('    - Error: ', err);
					}
				  	
				});
					
			}
				
			else
			{
				console.log('    Error: Result total not found.'.red);
				console.log();
			}
	  	}

	  	else
	  	{
	  		console.log('    Error occurred with the GET request!'.red);
	  		console.log('     - Response headers: ', response.headers);
	  		console.log('     - Error: ', error);
	  	}
	  		
	}
);

var saveScrape = function(db, scraped_data, callback) {
  // Get the scrape collection
  var collection = db.collection('indeedDaily');

  console.log(' 4. Attempting to insert the scrape into the "indeedDaily" collection'.yellow);
  // Insert the scraped data
  collection.insert(
	scraped_data
  	, function(err, result) {
    	assert.equal(err, null, 'Errors were returned with the scrape.');
    	console.log('    Data inserted successfully!'.green);
    	console.log('    - Data: ', result);

    	callback(result);
  });
}

