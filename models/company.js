var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var CompanySchema = new Schema({
	createdAt : { type: Date, default: Date.now },
  	activemodules : { type: String, required: true, index: { unique: false } },
  	key : { type: String, required: true, index: { unique: true } },
  	url : { type: String, required: true, index: { unique: false } },
  	name : { type: String, required: true, index: { unique: true } },
  	ownername : { type: String, required: true, index: { unique: true } }
});


 CompanySchema.methods.getMyCompany = function(user) {
   
  	
 };

module.exports = mongoose.model('Company', CompanySchema);
