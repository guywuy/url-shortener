const express = require('express');
const app = express();
app.use(express.static('public'));


//lets require/import the mongodb native drivers.
var mongodb = require('mongodb');

//We need to work with "MongoClient" interface in order to connect to a mongodb server.
var MongoClient = mongodb.MongoClient;

// Connection URL. This is where your mongodb server is running.
var url = 'mongodb://guy:guy@ds133044.mlab.com:33044/urls';

// Use connect method to connect to the Server
MongoClient.connect(url, function (err, db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } else {
    console.log('Connection established to', url);

    // do some work here with the database.

    //Close connection
    console.log('Closing connection to ', url);
    db.close();
  }
});

var routes = require('./routes/index');
app.use('/', routes);


app.listen(3000, function() {
	console.log('Listening on port 3000!');
});
