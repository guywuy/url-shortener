const express = require('express'),
app = express(),
exphbs = require('express-handlebars');
app.engine('handlebars', exphbs({
	defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//-----------------------------------DATABASE--------------------------
//lets require/import the mongodb native drivers.
var mongodb = require('mongodb');
//We need to work with "MongoClient" interface in order to connect to a mongodb server.
var MongoClient = mongodb.MongoClient;
// Connection URL. This is where your mongodb server is running.
// Standard URI format: mongodb://[dbuser:dbpassword@]host:port/dbname
var url = 'mongodb://guy:guy@ds133044.mlab.com:33044/urls';

//return a random int from 0-9
function generateRandomInt(){
  return Math.floor(Math.random()*10)
}
//return a random char from a-z
function generateRandomChar(){
  const chars = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'x', 'y', 'z'];
  return chars[Math.floor(Math.random()*chars.length)]
}


// Get homepage
app.get('/', (req, res, next)=>{
  res.render("home");
})
//User has submitted a URL. Add to db and respond with shortened corresponding key
app.post('/', (req, res)=>{
  let submittedURL = req.body.originalURL;
  let httpReg = /^http/g;
  if(!httpReg.test(submittedURL)) submittedURL = 'http://' + submittedURL;
  
  //generate short key of form [char, char, char, int, int, int]
  let shortenedKey = generateRandomChar() + generateRandomChar() + generateRandomChar() + generateRandomInt() + generateRandomInt() + generateRandomInt();
  let dbItemToInsert = {
      originalURL : submittedURL,
      shortURL : shortenedKey
    }
    
  // Use connect method to connect to the Server
  MongoClient.connect(url, function (err, db) {
    if (err) {
      console.log('Unable to connect to the mongoDB server. Error:', err);
    } else {
      console.log('Connection established to', url);

      //Insert the item
      db.collection('urlcollection').insertOne(dbItemToInsert, function(err, result) {
        if(err) throw err;
      });

      //Close connection
      console.log('Closing connection to ', url);
      db.close();
    }
  });
  let fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl + shortenedKey;
  res.render('success', { 'link': fullUrl });
})

// Get a shortened url key
app.get('/:shortkey', (req, res)=>{
  let shortKeyParam = req.params.shortkey;

  //Check db for :key, if it exists, redirect user to that, else, error
  MongoClient.connect(url, function (err, db) {
    if (err) {
      console.log('Unable to connect to the mongoDB server. Error:', err);
    } else {
      console.log('Connection established to', url);

      //http://mongodb.github.io/node-mongodb-native/2.1/tutorials/crud/
      db.collection('urlcollection').find({shortURL:shortKeyParam}).next(function(err, doc) {
        if (err) res.render('error');
        if (doc){
          res.redirect(doc.originalURL);
        } else {
          res.render('error');
        }
      });

      //Close connection
      console.log('Closing connection to ', url);
      db.close();
    }
  });
})

module.exports = app;
