var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var Search = require('bing.search');
var util = require('util');
var fs = require('fs');
var Recent = require('./models/recent');
var mongoose = require('mongoose');
var https = require('https');

//ENV VARIABLES

var searchKey = process.env.SEARCH_KEY;
var dbrl = process.env.DB_URL;






search = new Search(searchKey);
app.set('view engine','ejs');
// API REQUEST
function SearchObj(title,imgUrl,context,thumb){
  this.title = title;
  this.imgUrl = imgUrl;
  this.context = context;
  this.thumb = thumb;
}
function saveRecent(recent){
  recent.save(function(err) {
    if (err) {
      console.error(err);
    }
  });
}
var outputFilename = './tmp/tmp.json'
app.get('/:query',function(req, res) {
  var query =  req.params.query;
  var arr = [];
  var offset = req.query.offset;
  querySave = new Recent({'query':query});
  saveRecent(querySave);
  search.images(query,{top:10,skip:offset*10},function(err, data) {
    // console.log(data);
    for (var i = 0; i < data.length; i++) {
      var title = data[i].title;
      var imgUrl= data[i].url;
      var context = data[i].sourceUrl;
      var thumb = data[i].thumbnail.url;
      var sobj = new SearchObj(title,imgUrl,context,thumb);
      arr.push(sobj);
    }



res.json(arr);
  });
});
app.get('/search/recent',function(req,res) {

  Recent.find().select('created_at query  -_id').sort('-created_at').limit(10).exec(function(err, data) {
    res.json(data);

  });
});



// app.get('/:urlId',function(req, res) {
//   Link.findOne({short_url: req.headers.host+'/'+req.params.urlId},function(err, link) {
//     if (link!=null) {
//       if (err) {
//         console.error(err);
//       }else {
//           res.redirect(link.link);
//
//       }
//     }else {
//       res.end('You have provided non existing short url, try again');
//
//     }
//
//   });
// });

mongoose.connect(process.env.DB_URL);
app.listen(port,function() {
  console.log('On port', port);
})
