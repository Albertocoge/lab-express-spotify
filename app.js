require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:

const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
const PORT = process.env.PORT || 3000;
app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));

app.get('/', (req, res) => {
  res.render('index');
});


app.get('/artist-search', (req, res) => {
  const artistQuery = req.query.artist;

  spotifyApi
    .searchArtists(artistQuery)
    .then(data => {
      const artists = data.body.artists.items;
      res.render('artist-search-results', { artists });
    })
    .catch(err => console.log('Error to search astists:', err));
});

app.get('/albums/:artistId', (req, res) => {
  const artistId = req.params.artistId;

  spotifyApi
    .getArtistAlbums(artistId)
    .then(data => {
      const albums = data.body.items;
      res.render('albums', { albums });
    })
    .catch(err => console.log('Error al obtener los álbumes:', err));
});

app.get('/tracks/:albumId', (req, res) => {
  const albumId = req.params.albumId;

  spotifyApi
    .getAlbumTracks(albumId)
    .then(data => {
      const tracks = data.body.items;
      res.render('tracks', { tracks });
    })
    .catch(err => console.log('Error al obtener las pistas:', err));
});


