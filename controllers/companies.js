 var mongoose = require('mongoose'),
   User = mongoose.model('User'),
   Company = mongoose.model('Company'),
   passport = require('passport');

 // Get registration page
 exports.register = function(req, res) {
   console.log('creating new company');
   res.render('companies/new', {
     comp: new Company({})
   });
 }

 // Account page
 exports.account = function(req, res) {
   var user = req.user;
   Company.findOne({
     ownername: user.username
   }, function(err, comp) {
     if (err) return next(err);
     //if(!comp) return next(err);
     if (!comp) {
       return res.redirect('/cregister');
     } else {
       res.render('companies/edit', {
         comp: comp
       });
     }
   });

 }



 // Validations for user objects upon user update or create
 exports.companyValidations = function(req, res, next) {
   var creatingCompany = req.url == "/cregister";
   var updatingCompany = !creatingCompany; // only to improve readability
   req.assert('name', 'You must provide a company name.').notEmpty();
   req.assert('url', 'A URL for your company is required.').notEmpty();
   req.assert('publicemail', 'Contact email is required.').notEmpty();
   req.assert('address', 'You must provide a company address.').notEmpty();
   req.assert('zipcode', 'A zipcode for your company is required.').notEmpty();
   req.assert('city', 'City is required.').notEmpty();
   req.assert('state', 'State is required.').notEmpty();
   req.assert('publicemail', 'You must provide a public company email.').notEmpty();
   req.assert('telephone', 'A telephone number for your company is required.').notEmpty();
   var validationErrors = req.validationErrors() || [];
   // if (req.body.password != req.body.passwordConfirmation) validationErrors.push({msg:"Password and password confirmation did not match."});
   console.log('hi');
   if (validationErrors.length > 0) {

     validationErrors.forEach(function(e) {
       console.log('validation error' + e.msg);
       req.flash('error', e.msg);
     });
     // Create handling if errors present
     if (creatingCompany) return res.render('companies/new', {
       comp: new Company(req.body),
       errorMessages: req.flash('error')
     });
     // Update handling if errors present
     else return res.redirect("/program/");
   } else next();
 }

 exports.update = function(req, res, next) {
   var user = req.user;
   Company.findOne({
     ownername: user.username
   }, function(err, comp) {
     comp.set(req.body);
     comp.save(function(err, comp) {
       console.log(comp.name);
       // Uniqueness and Save Validations

       if (err && err.code == 11001) {
         var duplicatedAttribute = err.err.split("$")[1].split("_")[0];
         req.flash('error', "That " + duplicatedAttribute + " is already in use.");
         return res.redirect('/editcompany');
       }
       if (err) return next(err);
       req.flash('success', "Account updated successfully.");
       return res.redirect('/editcompany');
     });
   });
 }



 // Create company
 exports.create = function(req, res, next) {
   console.log('creating comp');
   var newCompany = new Company(req.body);
   var user = req.user;
   newCompany.ownername = req.user.username;
   newCompany.activemodules = "none";
   newCompany.key = Math.random().toString(36).slice(2);
   var thiskey = newCompany.key;
   console.log('building company with this keyh ' + thiskey);
   console.log('tring to generate base onlien price with zip ' + newCompany.zipcode);
   newCompany.generateBaseOnlinePrice(thiskey, req, res, newCompany.zipcode);
   newCompany.save(function(err, comp) {

     // Uniqueness and save validations

     if (err && err.code == 11000) {
       var duplicatedAttribute = err.err.split("$")[1].split("_")[0];
       req.flash('error', "That " + duplicatedAttribute + " is already in use.");
       return res.render('companies/new', {
         comp: newCompany,
         errorMessages: req.flash('error')
       });
     }
     if (err) return next(err);
     return res.redirect('/program');
   });

 }

 exports.updateonlinepricingavailability = function(req, res, next) {
  console.log('updateavailability');
   
 }

 exports.companyPriceValidations = function(req, res, next) {
  console.log('companyPriceValidations is loading');

   var creatingCompany = req.url == "/cregister";
   var updatingCompany = !creatingCompany; // only to improve readability
   req.assert('name', 'You must provide a company name.').notEmpty();
   req.assert('url', 'A URL for your company is required.').notEmpty();
   req.assert('publicemail', 'Contact email is required.').notEmpty();
   req.assert('address', 'You must provide a company address.').notEmpty();
   req.assert('zipcode', 'A zipcode for your company is required.').notEmpty();
   req.assert('city', 'City is required.').notEmpty();
   req.assert('state', 'State is required.').notEmpty();
   req.assert('publicemail', 'You must provide a public company email.').notEmpty();
   req.assert('telephone', 'A telephone number for your company is required.').notEmpty();
   var validationErrors = req.validationErrors() || [];
   // if (req.body.password != req.body.passwordConfirmation) validationErrors.push({msg:"Password and password confirmation did not match."});
   console.log('hi');
   if (validationErrors.length > 0) {

     validationErrors.forEach(function(e) {
       console.log('validation error' + e.msg);
       req.flash('error', e.msg);
     });
     // Create handling if errors present
     if (creatingCompany) return res.render('companies/new', {
       comp: new Company(req.body),
       errorMessages: req.flash('error')
     });
     // Update handling if errors present
     else return res.redirect("/program/");
   } else next();
 }

 exports.getCompanyOnlinePricing = function (req, res, next ){

 }
