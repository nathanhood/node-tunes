/* jshint unused:false */

'use strict';

var fs = require('fs');
var path = require('path');
var multiparty = require('multiparty');
var _ = require('lodash');
var songs = global.nss.db.collection('songs');
var albums = global.nss.db.collection('albums');
var artists = global.nss.db.collection('artists');

exports.index = (req, res)=>{
  songs.find().toArray((err, songs)=>{
    var genres = [];
    _(songs).forEach(song=>song.genres.forEach(g=>genres.push(g)));
    var uniqueGenres = _.unique(genres);

    res.render('songs/index', {songs: songs, genres: uniqueGenres, albums: albums, artists: artists, title: 'Node Tunes: Songs'});
  });
};



exports.create = (req, res)=>{
  var form = new multiparty.Form();


  form.parse(req, (err, fields, files)=>{

    var songName = fields.songName[0];
    var normalized = songName.split(' ').map(word=>word.trim()).map(word=>word.toLowerCase()).join('');
    var extension = path.extname(files.songFile[0].path);
    var artistName = fields.artistName[0];
    var albumName = fields.albumName[0];
    var newPath = `/audios/${artistName}/${albumName}/${normalized}${extension}`;
    var genres = fields.genres[0].split(',').map(word=>word.trim()).map(word=>word.toLowerCase());

    var song = {};

    albums.find({albumName: `${albumName}`}).toArray((err, albums)=>{
      artists.find({artistName: `${artistName}`}).toArray((err, artists)=>{

        song.albumId = albums[0]._id;
        song.artistId = artists[0]._id;
        song.albumPhoto = albums[0].albumPhoto;
        song.artistPhoto = artists[0].artistPhoto;
        song.songName = songName;
        song.songFile = `${normalized}${extension}`;
        song.artistName = artistName;
        song.albumName = albumName;
        song.genres = genres;


        if(!fs.existsSync(`${__dirname}/../static/audios/${artistName}`)){
          fs.mkdirSync(`${__dirname}/../static/audios/${artistName}`);
        }

        if(!fs.existsSync(`${__dirname}/../static/audios/${artistName}/${albumName}`)){
          fs.mkdirSync(`${__dirname}/../static/audios/${artistName}/${albumName}`);
        }

        fs.renameSync(files.songFile[0].path, `${__dirname}/../static/audios/${artistName}/${albumName}/${normalized}${extension}`);
        songs.save(song, ()=>res.redirect('/confirm'));

      });
    });
  });
};



exports.filter = (req, res)=>{
  var genre = req.query.genre;

  songs.find({genres: genre}).toArray((err, songsRefined)=>{
    songs.find().toArray((err, songs)=>{
      var genres = [];
      _(songs).forEach(song=>song.genres.forEach(g=>genres.push(g)));
      var uniqueGenres = _.unique(genres);

      res.render('songs/index', {songs: songsRefined, genres: uniqueGenres, albums: albums, artists: artists, title: 'Node Tunes: Songs'});
    });
  });
};
