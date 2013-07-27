var mongoose = require('mongoose')
  , User = mongoose.model('User')
  , Company = mongoose.model('Company')
  , passport = require('passport');

// Get registration page
exports.register = function(req, res){
  console.log('creating new company');
  res.render('companies/new', {comp: new Company({})});
}

// Account page
exports.account = function(req,res){
  var user = req.user;
    Company.findOne({ownername:user.username}, function(err, comp){
    console.log('asdfasdfasdffd');
    if(err) return next(err);
    //if(!comp) return next(err);
    if(!comp){
      return res.redirect('/cregister');
    }else{
      res.render('companies/edit',{
      comp:comp
    });
   }
    });
 
}



// Validations for user objects upon user update or create
exports.companyValidations = function(req, res, next){
  var creatingCompany = req.url == "/cregister";
  var updatingCompany = !creatingCompany; // only to improve readability
  req.assert('name', 'You must provide a company name.').notEmpty();
  req.assert('url', 'A URL for your company is required.').notEmpty();
  req.assert('email', 'Contact email is required.').notEmpty();
  // req.assert('email', 'Your email address must be valid.').isEmail();
  // req.assert('username', 'Username is required.').notEmpty();
  // if(creatingCompany || (updatingCompany && req.body.password)){
  //   req.assert('password', 'Your password must be 6 to 20 characters long.').len(6, 20);
  // }
  var validationErrors = req.validationErrors() || [];
  // if (req.body.password != req.body.passwordConfirmation) validationErrors.push({msg:"Password and password confirmation did not match."});
  if (validationErrors.length > 0){
    validationErrors.forEach(function(e){
      req.flash('error', e.msg);
    });
    // Create handling if errors present
    if (creatingCompany) return res.render('companies/new', {company : new Company(req.body), errorMessages: req.flash('error')});
    // Update handling if errors present
    else return res.redirect("/program/");
  } else next();
}


// Update user
exports.update = function(req, res, next){
  var user = req.user;
  Company.findOne({ownername:user.username}, function(err, comp){
    comp.set(req.body);
    comp.save(function(err, comp){
      console.log(comp.name);
      // Uniqueness and Save Validations
      
      if (err && err.code == 11001){
        var duplicatedAttribute = err.err.split("$")[1].split("_")[0];
        req.flash('error', "That " + duplicatedAttribute + " is already in use.");
        return res.redirect('/editcompany');
      }
      if(err) return next(err);
      
      // User updated successfully, redirecting
      
      req.flash('success', "Account updated successfully.");
      return res.redirect('/editcompany');
    });
  });
  //console.log(comp.name);
  // remove password attribute from form if not changing
  // if (!req.body.password) delete req.body.password;
  // // ensure valid current password
  // user.validPassword(req.body.currentPassword, function(err, isMatch){
  //   if(err) return next(err);
  //   if(isMatch) return updateUser();
  //   else return failedPasswordConfirmation();
  // });
  // Handle correct current password and changes to user
  // function updateCompany(){
  //   // use save instead of update to trigger 'save' event for password hashing
  //   user.set(req.body);
  //   user.save(function(err, user){
      
  //     // Uniqueness and Save Validations
      
  //     if (err && err.code == 11001){
  //       var duplicatedAttribute = err.err.split("$")[1].split("_")[0];
  //       req.flash('error', "That " + duplicatedAttribute + " is already in use.");
  //       return res.redirect('/account');
  //     }
  //     if(err) return next(err);
      
  //     // User updated successfully, redirecting
      
  //     req.flash('success', "Account updated successfully.");
  //     return res.redirect('/account');
  //   });
  // }
  // // Handle incorrect current password entry
  // function failedPasswordConfirmation(){
  //   req.flash('error', "Incorrect current password.");
  //   return res.redirect("/account");
  // }
}



// Create company
exports.create = function(req, res, next){
  console.log('creating comp');
  var newCompany = new Company(req.body);
  var user = req.user;
  newCompany.ownername = req.user.username;
  newCompany.activemodules = "none"; 
  newCompany.key = Math.random().toString(36).slice(2);
  var thiskey = newCompany.key;
  console.log('building company with this keyh '+thiskey);
  newCompany.generateBaseOnlinePrice(thiskey);
  newCompany.save(function(err, comp){
    
    // Uniqueness and save validations
    
    if (err && err.code == 11000){
      var duplicatedAttribute = err.err.split("$")[1].split("_")[0];
      req.flash('error', "That " + duplicatedAttribute + " is already in use.");
      return res.render('companies/new', {comp : newCompany, errorMessages: req.flash('error')});
    }
    if(err) return next(err);
    
    // New user created successfully, logging In
    return res.redirect('/program');
    // req.login(user, function(err) {
    //   if (err) { return next(err); }
    //   req.flash('success', "Account created successfully!");
    //   return res.redirect('/dashboard');
    // });
  });
  
}
