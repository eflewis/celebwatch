document.onLoad = function(){
	var celebName = "Eleanor Lewis";
	var message = "";
	var celebImg = "";


	//console.log($.getJSON("http://en.wikipedia.org/w/api.php?action=query&amp;format=json&amp;callback=?&titles=david_bowie");


	var goodTerms = ["release", "premier", "victory", "wedding", "happy", "good", "luck", "lucky", "joy", "joyous", "relief", "award", "honor", "friend", "acccolade", "healthy", "better", "baby", "birth", "birthday", "great"];
	var badTerms = ["arrest", "death", "murder", "fight", "brawl", "beating", "sad", "bad", "unhappy", "strain", "weed", "pot", "drunk", "shout", "yell", "fail", "accident", "illness", "dead", "flop", "bomb", "shame", "fat", "fatter", "complications", "divorce", "loss", "trouble", "police", "manhunt", "rant", "crime", "prison", "jail", "sentence", "split", "cancer"];

	var getImg = function(data){
		$("#celebImg").hide();
		for(i in data.items){
			if(data.items[i].displayLink == "www.imdb.com"){
				continue;
			}
			map = data.items[i].pagemap;
			if(map == undefined || map.cse_image == undefined){
				continue;
			}
			imgCandidate = map.cse_image[0].src;
			if(imgCandidate.slice(-3)=="jpg"){
				console.log(imgCandidate);
				celebImg = imgCandidate;
				$("#celebImg").attr('src', celebImg);
				if($("#celebImg").attr('width') > 100){$("#celebImg").show(); return;}
			}
		}
		$("#celebImg").show();
		console.log("no useable image found");
	}

	var setMessage = function(data){
		var goodTotal = 0;
		var badTotal = 0;
		for(j in data.items){
			map = data.items[j];
			snippet = map.snippet;
			for(t in goodTerms){
				if(snippet.indexOf(goodTerms[t]) != -1){
					goodTotal++;
				}
			}
			for(b in badTerms){
				if(snippet.indexOf(badTerms[b]) != -1){
					badTotal++;
				}
			}
		}
		console.log("good: " + goodTotal);
		console.log("bad: " + badTotal);
		var score = goodTotal - badTotal;
		if(score === 0){
			message = "Probably, yeah";
		} else if(score < 0){
			message = "Not at the moment :(";
		} else {
			message = "Yep";
		}
		$("#message").empty().html(message);
	}

	var fetchNews = function(celebName){
		$.ajax({
			url : "//www.googleapis.com/customsearch/v1?key=AIzaSyArG06AjUMqF4Bpt76mE4KyMk4j6Uz5iho&cx=012517050675633536745:ft8hkzzxkai&q="+encodeURIComponent(celebName)+"&alt=json&dateRestrict=d7",
			type : 'GET',
			dataType : 'jsonp',
			async : true, 
			success : function(data){setMessage(data);}
		});
	}

	var fetchImage = function(celebName){
		$.ajax({
			url : "//www.googleapis.com/customsearch/v1?key=AIzaSyArG06AjUMqF4Bpt76mE4KyMk4j6Uz5iho&cx=012517050675633536745:ft8hkzzxkai&q="+encodeURIComponent(celebName)+"&alt=json",
			type : 'GET',
			dataType : 'jsonp',
			async : true, 
			success : function(data){console.log(data);getImg(data);fetchNews(celebName);}

		});
	}

	$('#watchButton').click(function(){fetchImage($("#celeb").val());}
		//celebName = $("#celeb").val();
		
	);
	$('#searchInput').submit(function(){fetchImage($("#celeb").val());}
		//celebName = $("#celeb").val();
		
	);
}();