/* jshint unused:false */

'use strict';

var fs = require('fs');
var multiparty = require('multiparty');
var artists = global.nss.db.collection('artists');
var songs = global.nss.db.collection('songs');
var Mongo = require('mongodb');

exports.index = (req, res)=>{
  artists.find({}).sort({artistName: 1}).toArray((err, records)=>{
    res.render('artists/index', {artists: records, title: 'Node Tunes: Artists'});
  });
};


exports.create = (req, res)=>{
  var form = new multiparty.Form();

  form.parse(req, (err, fields, files)=>{

    if(!fs.existsSync(`${__dirname}/../static/img/${fields.artistName[0]}`)){
      var artist = {};
      artist.artistName = fields.artistName[0];

      files.artistPhoto.forEach(p=>{
        fs.mkdirSync(`${__dirname}/../static/img/${fields.artistName[0]}`);
        fs.renameSync(p.path, `${__dirname}/../static/img/${fields.artistName[0]}/${p.originalFilename}`);
        artist.artistPhoto = (p.originalFilename);
      });

      artists.save(artist, ()=>res.redirect('/confirm'));
    }else{
      res.redirect('/error');
    }
  });
};


exports.show = (req, res)=>{
  var _id = Mongo.ObjectID(req.params.id);

  artists.find({_id:_id}).toArray((err, artistData)=>{
    songs.find({artistId:_id}).toArray((err, songData)=>{
      res.render('artists/show', {songs: songData, artist: artistData, title: 'Node Tunes: '});
    });
  });
};
