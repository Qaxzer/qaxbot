var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var gameSchema = new Schema({
  game:  String,
  death: { type: Number, default: 0 },
});

var GameModel = mongoose.model('Game', gameSchema);

module.exports = GameModel;
