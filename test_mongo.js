/**
 * Some practice mongodb transactions
 */

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

var url = 'mongodb://localhost:27017/local';
// Use connect method to connect to the Server
MongoClient.connect(url, function(err, db) {
        console.log("Connected correctly to server");
        
        var collection = db.collection('testCollection');
        collection.find({}).toArray(function(err, docs) {
            assert.equal(err, null, 'Error while querying the database!');
            console.log("Found the following records");
            console.dir(docs);
            db.close();
        });      

    }
);

