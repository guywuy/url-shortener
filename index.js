const express = require('express');
const app = express();
app.use(express.static('public'));

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
	extended: true
})); // support encoded bodies



var routes = require('./routes/index');
app.use('/', routes);


app.listen(3000, function() {
	console.log('Listening on port 3000!');
});

module.exports = app;