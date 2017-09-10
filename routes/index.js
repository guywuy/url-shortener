const express = require('express'),
router = express.Router();

//-----------------------------------DATABASE--------------------------
//lets require/import the mongodb native drivers.
var mongodb = require('mongodb');
//We need to work with "MongoClient" interface in order to connect to a mongodb server.
var MongoClient = mongodb.MongoClient;
// Connection URL. This is where your mongodb server is running.
var url = 'mongodb://guy:guy@ds133044.mlab.com:33044/urls';



// Get homepage
router.get('/', (req, res, next)=>{
  res.sendFile('../public/index.html', {root: __dirname});
})
//User has submitted a URL. Add to db and respond with shortened corresponding key
router.post('/', (req, res)=>{
  let submittedURL = req.body.originalURL;
  console.log('Submitted url ', submittedURL);

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

  res.send(submittedURL);
})

// Get a shortened url key
router.get('/:key', (req, res)=>{
  let originalURL;
  let errorMsg = "Oops, couldn't find that. Are you sure you have the right url?";
  //Check db for :key, if it exists, redirect user to that, else, error

  res.redirect(originalURL);
})

module.exports = router;
