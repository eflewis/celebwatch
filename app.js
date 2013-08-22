var fs = require('fs'),
    http = require('http'),
    https = require('https'),
    express = require('express');

var port = 8888;

var options = {
    key: fs.readFileSync('elewis.key'),
    cert: fs.readFileSync('test.crt'),
};

var app = express();
app.use("/", express.static(__dirname));
app.use(express.bodyParser());

var server = https.createServer(options, app).listen(port, function(){
  console.log("Express server listening on port " + port);
});

app.get('/', function (req, res) {
    res.sendfile("index.html");
});