var express = require('express')
var bodyParser = require('body-parser')
app = express();

app.use(bodyParser.json());
app.use(express.static('public'));

var port = 8000

app.listen(port, function() {
	console.log('init');
});
