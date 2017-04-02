var keys = require('./keys.js');
var Twitter = require('twitter');
var spotify = require('spotify');
var request = require('request');
var fs = require("fs")

//this function pulls my last 20 tweets and when they were created
var getTweets = function() {

    var client = new Twitter(keys.twitterKeys);

    var params = { screen_name: 'Joshcbutler', count: 20};
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
            for (var i = 0; i < tweets.length; i++) {
                console.log(tweets[i].created_at);
                console.log(' ');
                console.log(tweets[i].text);
            }
        }
    });
}
//get artist name from spotify
var getArtistName = function(artist) {
    return artist.name;
}
//get song object info from spotify and loop through all the songs that spotify returns
var getSong = function(songName) {
    spotify.search({ type: 'track', query: songName }, function(err, data) {
        if (err) {
            console.log('Error occurred: ' + err);
            return;
        }

        var songs = data.tracks.items;
        for (var i = 0; i < songs.length; i++) {
            console.log(i);
            console.log('Artist(s): ' + songs[i].artists.map(
                getArtistName));
            console.log('Song name: ' + songs[i].name);
            console.log('Preview song: ' + songs[i].preview_url);
            console.log('Album: ' + songs[i].album.name);
            console.log('---------------------------------------------------');
        }

    });
}
//get movie information from omdb and console log all relevant information
var getMovie = function(movieName) {

    request('http://www.omdbapi.com/?t=' + movieName + '&y=&plot=short&r=json', function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var jsonData = JSON.parse(body);

            console.log('Title: ' + jsonData.Title);
            console.log('Year: ' + jsonData.Year);
            console.log('Rated: ' + jsonData.Rated);
            console.log('IMDB Rating: ' + jsonData.imdbRating);
            console.log('Country: ' + jsonData.Country);
            console.log('Language: ' + jsonData.Language);
            console.log('Plot: ' + jsonData.Plot);
            console.log('Actors: ' + jsonData.Actors);
            console.log('Rotten Tomatoes rating: ' + jsonData.tomatoRating);
            console.log('Rotten Tomatoes URL: ' + jsonData.tomatoURL);
        }
    });
}
//use file system to read what is in random.txt, split the information at the comma, and pass both arguments through the liri function
var doWhatItSays = function() {
    fs.readFile('random.txt', 'utf8', function(err, data) {
        if (err) throw err;
        var dataArr = data.split(',');
        if (dataArr.length == 2) {
            liri(dataArr[0], dataArr[1]);
        } else if (dataArr.length == 1) {
            (dataArr[0]);
        }
    });
}
//looks for user input to determine which function to call
var liri = function(caseData, functionData) {
    switch (caseData) {
        case 'my-tweets':
            getTweets();
            break;
        case 'spotify-this-song':
            getSong(functionData);
            break;
        case 'movie-this':
            getMovie(functionData);
        case 'do-what-it-says':
            doWhatItSays();
        default:
            console.log('LIRI does not know that information');
    }
}
//a variable to send process.argv at index 2 and 3 through the functions
var runThis = function(argOne, argTwo) {
    liri(argOne, argTwo);
};
//takes process arguments at indeces 2 and 3
runThis(process.argv[2], process.argv[3]);
