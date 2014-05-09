'use strict';

var fs = require('fs');
var multiparty = require('multiparty');
var artists = global.nss.db.collection('artists');

exports.index = (req, res)=>{
  res.render('artists/index', {title: 'Node Tunes: Artists'});
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

      artists.save(artist, ()=>res.redirect('/'));
    }else{
      res.redirect('/');
    }
  });
};
