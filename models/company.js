var mongoose = require('mongoose')
  , OnlinePrice = mongoose.model('OnlinePrice')
  , Schema = mongoose.Schema;

var CompanySchema = new Schema({
	createdAt : { type: Date, default: Date.now },
  	activemodules : { type: String, required: true, index: { unique: false } },
  	key : { type: String, required: true, index: { unique: true } },
  	url : { type: String, required: true, index: { unique: false } },
    address : { type: String, required: false, index: { unique: false } },  	
    zipcode : { type: String, required: false, index: { unique: false } },    
    city : { type: String, required: false, index: { unique: false } },    
    state : { type: String, required: false, index: { unique: false } },    
    publicemail : { type: String, required: false, index: { unique: false } },    
    telephone : { type: String, required: false, index: { unique: false } },    
    name : { type: String, required: true, index: { unique: true } },
  	tax : { type: String, default: 5, required: false, index: { unique: false } },   
    radius : { type: String, default: 30, required: false, index: { unique: false } },    
    ownername : { type: String, required: true, index: { unique: true } },
    //companyzip : { type: String, required: true, index: { unique: false } }

});

 CompanySchema.methods.generateBaseOnlinePrice = function(key, req, res, zip) {
 	console.log('going to try and make a onlinepricew with key '+key);
    var newOnlinePrice = new OnlinePrice();
    newOnlinePrice.key = key;
    console.log('setting this onlineprices companies zip to '+zip);
    newOnlinePrice.zipcode = zip;
    console.log('setting this onlineprice zip to '+zip);
    newOnlinePrice.save(function(err, price){
    
    // Uniqueness and save validations
    
    if (err && err.code == 11000){
      var duplicatedAttribute = err.err.split("$")[1].split("_")[0];
      console.log(duplicatedAttribute);
      req.flash('error', "That " + duplicatedAttribute + " is already in use.");
      return res.render('companies/new', {price : price, errorMessages: req.flash('error')});
    }
    if(err) console.log(err);
    
    // New user created successfully, logging In
    
    //return res.redirect('/program');
    
    // req.login(user, function(err) {
    //   if (err) { return next(err); }
    //   req.flash('success', "Account created successfully!");
    //   return res.redirect('/dashboard');
    // });
  });
    console.log('made price with email'+newOnlinePrice.email);

 };

 CompanySchema.methods.getMyCompany = function(user) {
   
  	
 };

module.exports = mongoose.model('Company', CompanySchema);
