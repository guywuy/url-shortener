const express = require('express'),
router = express.Router();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
	extended: true
})); // support encoded bodies


// Get homepage
router.get('/', (req, res, next)=>{
  res.sendFile('../public/index.html', {root: __dirname});
})
//User has submitted a URL. Add to db and respond with shortened corresponding key
router.post('/', (req, res)=>{

})

// Get a shortened url key
router.get('/:key', (req, res)=>{
  let originalURL;
  let errorMsg = "Oops, couldn't find that. Are you sure you have the right url?";
  //Check db for :key, if it exists, redirect user to that, else, error
  
  res.redirect(originalURL);
})

module.exports = router;
