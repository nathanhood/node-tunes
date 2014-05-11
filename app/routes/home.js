'use strict';

var artists = global.nss.db.collection('artists');
var albums = global.nss.db.collection('albums');

exports.index = (req, res)=>{
  artists.find().toArray((err, artists)=>{
    albums.find().toArray((err, albums)=>{
      res.render('home/index', {artists: artists, albums: albums, title: 'Node Tunes: Home'});
    });
  });
};

exports.help = (req, res)=>{
  res.render('home/help', {title: 'Node Tunes: Help'});
};

exports.confirm = (req, res)=>{
  artists.find().toArray((err, artists)=>{
    albums.find().toArray((err, albums)=>{
      res.render('home/confirm', {artists: artists, albums: albums, title: 'Node Tunes: Home'});
    });
  });
};

exports.error = (req, res)=>{
  artists.find().toArray((err, artists)=>{
    albums.find().toArray((err, albums)=>{
      res.render('home/error', {artists: artists, albums: albums, title: 'Node Tunes: Home'});
    });
  });
};
