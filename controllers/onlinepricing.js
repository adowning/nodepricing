var mongoose = require('mongoose')
  , User = mongoose.model('User')
  , OnlinePrice = mongoose.model('OnlinePrice')
  , Order = mongoose.model('Order')
  , Company = mongoose.model('Company');

var op;
 exports.fetch = function (req, res){
  var key = req.params.id;
  OnlinePrice.findOne({key:key}, function(err, pricing){
    if(err) return next(err);
    if(!pricing){
      return res.redirect('/badkey');
    }else{
      op = pricing;
        res.render('onlinepricing/', { pricing:pricing });
   }
    });
 
 }

 exports.thanks = function (req, res){
  console.log('thanks in op');
  res.render('onlinepricing/thanks');
  //TODO add some catches here later

  // var key = req.params.id;
  // OnlinePrice.findOne({key:key}, function(err, order){
  //   if(err) return next(err);
  //   if(!order){
  //     return res.redirect('/badorder');
  //   }else{
  //     od = order;
  //       res.render('onlinepricing/thanks', { order:order });
  //  }
  //   });
 
 }

 exports.getonlinepricing = function (req, res, next){
       res.contentType('json');
       res.send({ some: op });
 }

exports.create = function(req, res, next){
	console.log('created!!! with key '+req.params.id);
  //var newOnlineprice = new OnlinePrice(req.body);
  var newOrder = new Order(req.body);
  newOrder.save(function(err, order){

    if (err && err.code == 11000){
      console.log('duped atrib-prereg = '+ err.err);
      var duplicatedAttribute = err.err.split("$")[1].split("_")[0];
      console.log('duped atrib = '+ duplicatedAttribute);
      req.flash('error', "That " + duplicatedAttribute + " is already in use.");
      console.log('returning req.flash '+req.flash);
      //return res.render('users/new', {user : newUser, errorMessages: req.flash('error')});
    }
    if(err) return next(err);
    console.log('made order with email '+order.email);
    //success
      req.flash('success', "Order created successfully!");
      return res.redirect('onlinepricing/thanks', {order: order});
    });
  // var newUser = new User(req.body);
  // newUser.save(function(err, user){
    
  //   // Uniqueness and save validations
    
  //   if (err && err.code == 11000){
  //     var duplicatedAttribute = err.err.split("$")[1].split("_")[0];
  //     req.flash('error', "That " + duplicatedAttribute + " is already in use.");
  //     console.log('returning req.flash '+req.flash);
  //     //return res.render('users/new', {user : newUser, errorMessages: req.flash('error')});
  //   }
  //   if(err) return next(err);
    

  //   // // New user created successfully, logging In
    
  //   // req.login(user, function(err) {
  //   //   if (err) { return next(err); }
  //   //   req.flash('success', "Account created successfully!");
  //   //   return res.redirect('/dashboard');
  //   // });
  // });
}

exports.onlinePricingValidations = function(req, res, next){
	console.log('pricingvalidations hit 34 ');
  var creatingorder = req.url == "/createonlineprice";
  //var updatingUser = !creatingUser; // only to improve readability
  req.assert('email', 'You must provide an email address.').notEmpty();
  req.assert('name', 'Name is required.').notEmpty();
  req.assert('address', 'Address is required.').notEmpty();
  // if(creatingUser || (updatingUser && req.body.password)){
  //   req.assert('password', 'Your password must be 6 to 20 characters long.').len(6, 20);
  // } 
  var validationErrors = req.validationErrors() || [];
  //if (req.body.password != req.body.passwordConfirmation) validationErrors.push({msg:"Password and password confirmation did not match."});
  if (validationErrors.length > 0){
    console.log('val errors -='+validationErrors.length);
    validationErrors.forEach(function(e){
      req.flash('error', e.msg);
    });
    // Create handling if errors present
    if (creatingUser) return res.render('orders/new', {order : new Order(req.body), errorMessages: req.flash('error')});
    // Update handling if errors present
    else return res.redirect("/badorder");
  } else console.log('nexting'); next();
}
