var mongoose = require('mongoose')
  , OnlinePrice = mongoose.model('OnlinePrice')
  , Schema = mongoose.Schema;

var CompanySchema = new Schema({
	createdAt : { type: Date, default: Date.now },
  	activemodules : { type: String, required: true, index: { unique: false } },
  	key : { type: String, required: true, index: { unique: true } },
  	url : { type: String, required: true, index: { unique: false } },
  	name : { type: String, required: true, index: { unique: true } },
  	ownername : { type: String, required: true, index: { unique: true } }
});

 CompanySchema.methods.generateBaseOnlinePrice = function(key) {
 	console.log('going to try and make a onlinepricew with key '+key);
    var newOnlinePrice = new OnlinePrice();
    newOnlinePrice.key = key;
    newOnlinePrice.setBase();
    newOnlinePrice.save(function(err, company){
    
    // Uniqueness and save validations
    
    // if (err && err.code == 11000){
    //   var duplicatedAttribute = err.err.split("$")[1].split("_")[0];
    //   req.flash('error', "That " + duplicatedAttribute + " is already in use.");
    //   return res.render('companies/new', {company : newCompany, errorMessages: req.flash('error')});
    // }
    // if(err) return next(err);
    
    // New user created successfully, logging In
    
    //return res.redirect('/program');
    
    // req.login(user, function(err) {
    //   if (err) { return next(err); }
    //   req.flash('success', "Account created successfully!");
    //   return res.redirect('/dashboard');
    // });
  });


 };

 CompanySchema.methods.getMyCompany = function(user) {
   
  	
 };

module.exports = mongoose.model('Company', CompanySchema);