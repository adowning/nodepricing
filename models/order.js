var mongoose = require('mongoose')
  , Company = mongoose.model('Company')
  , Schema = mongoose.Schema

var OrderSchema = new Schema({
	createdAt : { type: Date, default: Date.now },
  	email : { type: String, required: true, index: { unique: false } },
    companyid : { type: String, required: true, index: { unique: false } },
    ordernumber : { type: String, required: true, index: { unique: false}},
  	name : { type: String, required: true, index: { unique: false } },
  	address : { type: String, required: true, index: { unique: false } },
  	city : { type: String, required: true, index: { unique: false } },
    state : { type: String, required: true, index: { unique: false } },
    telephone : { type: String, required: true, index: { unique: false } },
  	scheduledate : { type: String, required: true, index: { unique: false } },
  	scheduletime : { type: String, required: true, index: { unique: false } },
  	zipcode : { type: String, required: true, index: { unique: false } },
  	services : { type: Object, required: true, index: { unique: false } },
  	instructions : { type: String, default: 'None.', required: false, index: { unique: false } },
    services_totals : { type: Object, required: true, index: { unique: false } },

});


// OrderSchema.methods.findOrderCountForCompany = function(keyid) {
//     var count = 0;
//     Company.find(function(err,companies){
//     if(err) return next(err);
//     for (var i in companies) {
//       var thiscomp = companies[i];
//       if(thiscomp.key == keyid){
//         console.log('found a bitch');
//         count++;
//         console.log('incide count '+count);
//       }
// }
//     });
//     console.log('count = '+count);
//     return count;
//  };


module.exports = mongoose.model('Order', OrderSchema);
