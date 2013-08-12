var mongoose = require('mongoose'),
  User = mongoose.model('User'),
  OnlinePrice = mongoose.model('OnlinePrice'),
  Order = mongoose.model('Order'),
  Company = mongoose.model('Company');
//todo fix me for production
try{
var moment = require('moment');
}catch(err){
  console.log(err);
}
var op;
var comp;

exports.fetch = function(req, res) {
  var key = req.params.id;
  OnlinePrice.findOne({
    key: key
  }, function(err, pricing) {
    if (err) return next(err);
    if (!pricing) {
      return res.redirect('/badkey');
    } else {
      op = pricing;
      res.render('onlinepricing/', {
        pricing: pricing,
        comp: comp
      });
    }
  });

}

exports.getonlinepricing = function(req, res, next) {
  res.contentType('json');
  res.send({
    some: op,
    comp: comp
  });
}

exports.createorder = function(req, res, next) {
  console.log('created!!! with key ' + req.params.id);
  var comp;
  Company.findOne({
    key: req.params.id
  }, function(err, company) {
    if (err) return next(err);
    //if(!comp) return next(err);
    if (!company) {
      return res.redirect('/badorder');
    } else {
      // res.render('companies/edit',{
      // comp:comp
      //console.log('company found! '+ company.name);  
      comp = company;
    }

    var newOrder = new Order(req.body);
    //var ordernumber = newOrder.findOrderCountForCompany(req.params.id);
    ////console.log('on '+ordernumber);
    newOrder.companyid = req.params.id;
    ////console.log('here: '+ newOrder.ordernumber);
    newOrder.ordernumber = parseInt(comp.ordertotal) + 1;
    updateOrderTotal(comp);
    newOrder.save(function(err, order) {
      if (err && err.code == 11000) {
        //console.log('duped atrib-prereg = '+ err.err);
        var duplicatedAttribute = err.err.split("$")[1].split("_")[0];
        //console.log('duped atrib = '+ duplicatedAttribute);
        req.flash('error', "That " + duplicatedAttribute + " is already in use.");
        //console.log('returning req.flash '+req.flash);
        //return res.render('users/new', {user : newUser, errorMessages: req.flash('error')});
      }
      if (err) return next(err);
      //console.log('made order with email '+order.email);
      //success
      req.flash('success', "Order created successfully!");
      var result = JSON.parse(order.services);
      ////console.log(result.plugin);
      order.services = result;
      var result2 = JSON.parse(order.services_totals);
      order.services_totals = result2;
      order.showNumber = parseInt(order.ordernumber) + 3000;
      console.log(moment(order.scheduledate).format("YYYY-MM-DD"));
      try{
      order.formateddate = moment(order.scheduledate).format("YYYY-MM-DD");
}catch(err){
  order.formateddate = "error in prod";
}
      return res.render('onlinepricing/thanks', {
        order: order,
        comp: comp
      });

      res.mailer.send('mailer/order_sent', {
        to: order.email,
        subject: 'Your Upcoming Cleaning Details',
        subtotal: order.subtotal
      }, function(err) {
        if (err) return next(err);
        // Sent email instructions, alerting user
        req.flash('success', "You will receive a link to reset your password at " + req.body.email + ".");
        res.redirect('/');
      });

      console.log('email sent ');
    });

  });
}

exports.pricesetting = function(req,res){
  res.render('companies/onlinepricing');
}

// Update user
exports.update = function(req, res, next){
  var user = req.user;
  // remove password attribute from form if not changing
  if (!req.body.password) delete req.body.password;
  // ensure valid current password
  user.validPassword(req.body.currentPassword, function(err, isMatch){
    if(err) return next(err);
    if(isMatch) return updateUser();
    else return failedPasswordConfirmation();
  });
  // Handle correct current password and changes to user
  function updateUser(){
    // use save instead of update to trigger 'save' event for password hashing
    user.set(req.body);
    user.save(function(err, user){
      
      // Uniqueness and Save Validations
      
      if (err && err.code == 11001){
        var duplicatedAttribute = err.err.split("$")[1].split("_")[0];
        req.flash('error', "That " + duplicatedAttribute + " is already in use.");
        return res.redirect('/account');
      }
      if(err) return next(err);
      
      // User updated successfully, redirecting
      
      req.flash('success', "Account updated successfully.");
      return res.redirect('/account');
    });
  }
  // Handle incorrect current password entry
  function failedPasswordConfirmation(){
    req.flash('error', "Incorrect current password.");
    return res.redirect("/account");
  }
}

// Create user
exports.create = function(req, res, next){
  var newUser = new User(req.body);
  newUser.save(function(err, user){
    
    // Uniqueness and save validations
    
    if (err && err.code == 11000){
      var duplicatedAttribute = err.err.split("$")[1].split("_")[0];
      req.flash('error', "That " + duplicatedAttribute + " is already in use.");
      return res.render('users/new', {user : newUser, errorMessages: req.flash('error')});
    }
    if(err) return next(err);
    
    // New user created successfully, logging In
    
    req.login(user, function(err) {
      if (err) { return next(err); }
      req.flash('success', "Account created successfully!");
      return res.redirect('/dashboard');
    });
  });
}

// Validations for user objects upon user update or create
exports.onlinePricingValidations = function(req, res, next){
  //console.log('pricingvalidations hit 34 ');
  //console.log(req.body);
  var creatingorder = req.url == "/onlinepricing";
  //var updatingUser = !creatingUser; // only to improve readability
  req.assert('name', 'Name is required.').notEmpty();
  req.assert('email', 'You must provide an email address.').notEmpty();
  req.assert('telephone', 'Telephone is required.').notEmpty();
  req.assert('address', 'Address is required.').notEmpty();
  req.assert('scheduledate', 'schedule date Error').notEmpty();
  req.assert('scheduletime', 'sched time Error').notEmpty();
  req.assert('zipcode', 'zip Error').notEmpty();
  req.assert('city', 'city Error').notEmpty();
  req.assert('state', 'state Error').notEmpty();
  req.assert('services', 'services Error').notEmpty();
  req.assert('services_totals', 'servicestotals Error').notEmpty();
 
  //console.log(req.body.email);
  ////console.log(req.body.services.carpet.toString());
  // if(creatingUser || (updatingUser && req.body.password)){
  //   req.assert('password', 'Your password must be 6 to 20 characters long.').len(6, 20);
  // } 
  console.log('validating');
  var validationErrors = req.validationErrors() || [];
  //if (req.body.password != req.body.passwordConfirmation) validationErrors.push({msg:"Password and password confirmation did not match."});
  if (validationErrors.length > 0){
    //console.log('val errors= '+validationErrors.length);
    validationErrors.forEach(function(e){
      console.log(e.msg);
      req.flash('error', e.msg);
    });
    // Create handling if errors present
    //if (creatingUser) return res.render('orders/new', {order : new Order(req.body), errorMessages: req.flash('error')});
    // Update handling if errors present
    return res.redirect("/badorder");
  } else console.log('nexting'); next();
}