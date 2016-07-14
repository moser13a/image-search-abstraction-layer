var mongoose = require('mongoose');
var Schema = require('mongoose').Schema;
var recentSchema = new Schema({
  query: String,
},{timestamps : {createdAt: 'created_at'}})
var Recent = mongoose.model('recent',recentSchema);
module.exports = Recent;
