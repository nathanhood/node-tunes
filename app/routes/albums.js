'use strict';

var fs = require('fs');
var multiparty = require('multiparty');
var albums = global.nss.db.collection('albums');
var songs = global.nss.db.collection('songs');
var Mongo = require('mongodb');

exports.index = (req, res)=>{
  albums.find().sort({albumName: 1}).toArray((err, records)=>{
    res.render('albums/index', {albums: records, title: 'Node Tunes: Albums'});
  });
};

exports.create = (req, res)=>{
  var form = new multiparty.Form();

  form.parse(req, (err, fields, files)=>{
    // console.log('--------FIELDS-----------');
    // console.log(fields);
    // console.log(files);
    if(!fs.existsSync(`${__dirname}/../static/img/${fields.artistName[0]}/${fields.albumName[0]}`)){
      var album = {};
      album.albumName = fields.albumName[0];
      album.artistName = fields.artistName[0];

      files.albumPhoto.forEach(p=>{
        fs.mkdirSync(`${__dirname}/../static/img/${fields.artistName[0]}/${fields.albumName[0]}`);
        fs.renameSync(p.path, `${__dirname}/../static/img/${fields.artistName[0]}/${fields.albumName[0]}/${p.originalFilename}`);
        album.albumPhoto = (p.originalFilename);
      });

      albums.save(album, ()=>res.redirect('/'));
    }else{
      res.redirect('/');
    }
  });
};

exports.show = (req, res)=>{
  var _id = Mongo.ObjectID(req.params.id);

  albums.find({_id:_id}).toArray((err, albumData)=>{
    songs.find({albumId:_id}).toArray((err, songData)=>{
      res.render('albums/show', {songs: songData, album: albumData, title: 'Node Tunes: '});
    });
  });
};
