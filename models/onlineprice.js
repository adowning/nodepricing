var mongoose = require('mongoose')
  , Schema = mongoose.Schema;
 

var OnlinePricingSchema = new Schema({
	createdAt : { type: Date, default: Date.now },
  	activemodules : { type: String, required: true, index: { unique: false } },
  	key : { type: String, required: true, index: { unique: true } },
  	url : { type: String, required: true, index: { unique: false } },
  	name : { type: String, required: true, index: { unique: true } },
  	ownername : { type: String, required: true, index: { unique: true } }
});


 CompanySchema.methods.getOnlinePrice = function(user) {
   
  	
 };

module.exports = mongoose.model('OnlinePrice', OnlinePriceSchema);
