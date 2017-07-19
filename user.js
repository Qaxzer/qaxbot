var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema({
  name:  String,
  level: { type: Number, default: 1 },
  experience: { type: Number, default: 0 },
});

var UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
