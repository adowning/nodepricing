var mongoose = require('mongoose')
  , Schema = mongoose.Schema

var AbandonemntSchema = new Schema({
	createdAt : { type: Date, default: Date.now },
  key : { type: String, default: "error" },
  exitpage : { type: String, default: "error" }
  
});


module.exports = mongoose.model('Abandonment', AbandonemntSchema);
