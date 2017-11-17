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



// Get homepage
app.get('/', (req, res, next)=>{
  res.render("home");
})
//User has submitted a URL. Add to db and respond with shortened corresponding key
app.post('/', (req, res)=>{
  let submittedURL = req.body.originalURL;
  let httpReg = /^http/g;
  if(!httpReg.test(submittedURL)) submittedURL = 'http://' + submittedURL;

  let shortenedKey = Math.floor(Math.random()*10000);
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
  let shortKeyParam = parseInt(req.params.shortkey, 10);
  console.log('Short key from URL ', shortKeyParam);
  //Check db for :key, if it exists, redirect user to that, else, error
  MongoClient.connect(url, function (err, db) {
    if (err) {
      console.log('Unable to connect to the mongoDB server. Error:', err);
    } else {
      console.log('Connection established to', url);

      //http://mongodb.github.io/node-mongodb-native/2.1/tutorials/crud/
      db.collection('urlcollection').find({shortURL:shortKeyParam}).next(function(err, doc) {
        let errorMsg = "Oops, couldn't find that. Are you sure you have the right url?";
        if (err) res.send(errorMsg);
        // console.log(doc);
        if (doc){
          res.redirect(doc.originalURL);
        } else {
          res.send(errorMsg);
        }
        // console.log(doc.originalURL);
        // originalURL = doc.originalURL;
      });

      //Close connection
      console.log('Closing connection to ', url);
      db.close();
    }
  });
})

module.exports = app;
