'use strict';

var artists = global.nss.db.collection('artists');

exports.index = (req, res)=>{
  artists.find().toArray((err, records)=>{
    res.render('home/index', {artists: records, title: 'Node Tunes: Artists'});
  });
};

exports.help = (req, res)=>{
  res.render('home/help', {title: 'Node Tunes: Help'});
};
