var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var statSchema = new Schema({
  name:  String,
  warning: { type: Number, default: 0 },
  isBan: { type: Boolean, default: false },
  banCount: { type: Number, default: 0 },
  permaBan: { type: Boolean, default: false},
  activityCount: { type: Number, default: 0 },
  qaxpoint: { type: Number, default: 0 },
});

var StatsModel = mongoose.model('Stats', statSchema);

module.exports = StatsModel;
