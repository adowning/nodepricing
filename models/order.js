var mongoose = require('mongoose')
  , Schema = mongoose.Schema

var OrderSchema = new Schema({
	createdAt : { type: Date, default: Date.now },
  	email : { type: String, required: true, index: { unique: false } },
  	name : { type: String, required: true, index: { unique: false } },
  	address : { type: String, required: true, index: { unique: false } },

});

module.exports = mongoose.model('Order', OrderSchema);
