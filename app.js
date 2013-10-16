var fs = require('fs'),
    http = require('http'),
    https = require('https'),
    express = require('express');
    cheerio = require('cheerio');
    request = require('request');

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

app.post('/getDead', function(req, res){
	var celebName = req.body.celebName;
	var spInd = celebName.indexOf(' ');
	while(spInd != -1){
		var beg = celebName.slice(0, spInd);
		var end = celebName.slice(spInd+1);
		celebName = beg + "_" + end;
		spInd = celebName.indexOf(' ');
	}
	var url = 'http://www.wikipedia.org/wiki/' + celebName
	request(url, function(err, resp, body){
		if(err){
			throw(err);
		} else {
			$ = cheerio.load(body);
			var dead = false;
			var infoItems = $('.infobox.vcard').find('th');
			var item = 0;
			var foundTruth = false;
			while(foundTruth === false){
				if(!infoItems[item] || !infoItems[item].children){
					continue;
				}
				if(infoItems[item].children[0].data){
					if(infoItems[item].children[0].data == 'Died'){
						dead = true;
						foundTruth = true;
					}
				}
				item ++;
				if(item >= infoItems.length){
					foundTruth = true;
				}
			}
			res.send({'dead' : dead});
		}
	});
});