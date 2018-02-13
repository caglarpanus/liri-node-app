//Node packages that we require.
require("dotenv").config();

var request = require('request');
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var keys = require("./keys.js");
const fs = require('fs');
//In order to get the keys.
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var command = process.argv[2];
let input = "";

//In order to get the input from the user. It must be third because first and second ones are Node argument
for (var i = 3; i < process.argv.length; i++){
    input= input + " " + process.argv[i];
}

//This will print the spotify info to the terminal. 
//node liri.js spotify-this-song '<song name here>'
function theSpotify(){

  spotify.search({ type: 'track', query: input}, function (error, data) {
    if (error) {
        return console.log("Error occurred: " + error);
    }
    var song = (data.tracks.items[0]);
    var artists = song.artists;
    if (artists){
        artists.forEach(function (element) {
            console.log("Artist: " + element.name);
        });
    };
    console.log("Track Name: " + song.name);
    console.log("Preview Link: " + song.external_urls.spotify);
    console.log("Album: " + song.album.name);
    console.log("________________\n");
  });

};

//This function will bring us the latest 20 tweets of the key owner.
//You must search le this ==> node liri.js my-tweets
function tweets(){

    client.get('statuses/user_timeline', function(error, tweets, response){
  
        if (!error){
          console.log("These are my tweets: \n");
          for (var i = 0; i < 20; i++){
            var theTweets= tweets[i];
            console.log(theTweets.created_at);
            console.log(theTweets.text);
            console.log("_______________\n");
          };
        };
    });
  };
//Prints movie information to the terminal.You must search le this ==> node liri.js movie-this '<movie name here>'
function omdb() {
  request("http://www.omdbapi.com/?t=" + input + "&y=&plot=short&apikey=trilogy", function (error, response, body) {
      if (!error && response.statusCode === 200) {
          var movie = JSON.parse(body);
          console.log("Information about the movie: \n"); 
          console.log("Title: " + (movie.Title)); 
          console.log("Year: " + (movie.Year)); 
          console.log("IMDB Rating: " + (movie.imdbRating + "/10"));
          if (movie.Ratings[1]){
              console.log("Rotten Tomatoes Rating: " + movie.Ratings[1].Value); 
          }
          else {
              console.log("Rotten Tomatoes Rating: No Rotten Tomatoes Rating Available");
          }
          console.log("Country: " + (movie.Country));
          console.log("Language(s): " + (movie.Language));
          console.log("Plot: " + (movie.Plot));
          console.log("Actors: " + (movie.Actors));
          console.log("_____________\n"); 
      };
  });
};
//Using the fs Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.
//There is an example in the random.txt file. You need to run ==> node liri.js do-what-it-says.
//You can change text in random.txt.
function fsPackage(){

  fs.readFile("random.txt","utf8", function(error,data){
      if(error){
        return console.log(error);
      }
      
      var dataArr = data.split(",");
      input = dataArr[1]
      command = dataArr[0];
      run();
  });
};
//liri.js can take in one of the following commands.
function run(){
  switch (command){
    case "my-tweets":
      tweets();
        break;

    case "spotify-this-song":
      theSpotify();
        break;

    case "movie-this":
        omdb();
        break;

    case "do-what-it-says":
    fsPackage();
        break;
  }
}

run();