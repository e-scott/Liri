var fs = require('fs');
var request = require('request');
var env = require("dotenv").config();
var Spotify = require('node-spotify-api');
var keys = require('./keys.js');
var moment = require('moment');
var axios = require('axios')
var nodeArgv = process.argv[2];


switch (nodeArgv) {
    case "spotify-this-song":
        spotifySong();
        break;

    case "movie-this":
        movieThis();
        break;

    case "do-what-it-says":
        doWhatItSays();
        break;

    case "concert-this":
        concertThis();
        break;
};



function concertThis(){
   
    
    var artist = process.argv[3];
    var url = `https://rest.bandsintown.com/artists/${artist}/events?app_id=codingbootcamp`;

        request(url, function(err, response, body) { 
            Object.keys(body).forEach( (elem, index) => {
                if (typeof JSON.parse(body)[index] !== "undefined"){
                   console.log(`Event ${index}`);
                   //console.log("Lineup: " + JSON.parse(body[index].lineup));
                   console.log("Venue Name: " + JSON.parse(body)[index].venue.name);
                   console.log("Venue City: " + JSON.parse(body)[index].venue.city);
                   var time = JSON.parse(body)[index].datetime;
                   var date = moment(time).format("LLL")
                   console.log("When: " + date);
                   console.log("\n");
                }
            })
           }
       )
      
    }

function movieThis() {
    //
    var searchMovie;
    if (process.argv[3] === undefined) {
        searchMovie = "Mr. Nobody";
    } else {
        searchMovie = process.argv[3];
    };

    var url = 'https://www.omdbapi.com/?apikey=fa71f0a8&r=json&tomatoes=true&t=' + searchMovie;
    request(url, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            
            console.log("Title: " + JSON.parse(body).Title);
            console.log("Year: " + JSON.parse(body).Year);
            console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
            console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
            console.log("Country: " + JSON.parse(body).Country);
            console.log("Language: " + JSON.parse(body).Language);
            console.log("Plot: " + JSON.parse(body).Plot);
            console.log("Actors: " + JSON.parse(body).Actors);
        }
    });
};

function spotifySong() {

    var spotify = new Spotify({
        id: '119c499171474f3893dc42ebbb546aa5',
        secret: '4c95e886beeb4a2d9712127f0c22b9e5'
    });

    var songName = process.argv[3];
		if(!songName){
			songName = "The Sign ace of base";
		}
		params = songName;
		spotify.search({ type: "track", query: params }, function(err, data) {
			if(!err){
				var songInfo = data.tracks.items;
				for (var i = 0; i < 5; i++) {
					if (songInfo[i] != undefined) {
						var spotifyResults =
						"Artist: " + songInfo[i].artists[0].name + "\r\n" +
						"Song: " + songInfo[i].name + "\r\n" +
						"Album the song is from: " + songInfo[i].album.name + "\r\n" +
						"Preview Url: " + songInfo[i].preview_url + "\r\n" + 
						"------------------------------ " + i + " ------------------------------" + "\r\n";
						console.log(spotifyResults);
					}
				}
			}	else {
				console.log("Error :"+ err);
				return;
			}
		});
    };
    
    function doWhatItSays() {
		fs.readFile("random.txt", "utf8", function(error, data){
			if (!error) {
				doWhatItSaysResults = data.split(",");
				spotifySong(doWhatItSaysResults[0], doWhatItSaysResults[1]);
			} else {
				console.log("Error occurred" + error);
			}
		});
	};
