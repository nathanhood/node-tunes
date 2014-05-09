'use strict';

var fs = require('fs');
var multiparty = require('multiparty');
var albums = global.nss.db.collection('albums');
// var artists = global.nss.db.collection('artists');

exports.index = (req, res)=>{
  res.render('albums/index', {title: 'Node Tunes: Albums'});
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

      files.albumPhoto.forEach(p=>{
        console.log(`${__dirname}/../static/img/${fields.artistName[0]}/${fields.albumName[0]}`);
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
