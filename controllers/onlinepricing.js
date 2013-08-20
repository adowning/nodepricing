var mongoose = require('mongoose'),
  User = mongoose.model('User'),
  OnlinePrice = mongoose.model('OnlinePrice'),
  Order = mongoose.model('Order'),
  Company = mongoose.model('Company');
//todo fix me for production
try {
  var moment = require('moment');
} catch (err) {
  console.log(err);
}
var op;
var comp;

exports.fetch = function(req, res) {
  var key = req.params.id;
  setGVars(key, res);
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
    some: op
    //comp: comp
  });
}

exports.createorder = function(req, res, next) {
  var tcomp;
  Company.findOne({
    key: req.params.id
  }, function(err, company) {
    if (err) return next(err);
    //if(!comp) return next(err);
    if (!company) {
      return res.redirect('/badorder');
    } else {
      tcomp = company;
      var newOrder = new Order(req.body);
      //var ordernumber = newOrder.findOrderCountForCompany(req.params.id);
      ////console.log('on '+ordernumber);
      newOrder.companyid = req.params.id;
      ////console.log('here: '+ newOrder.ordernumber);
      newOrder.ordernumber = parseInt(tcomp.ordertotal) + 1;
      tcomp.ordertotal = parseInt(tcomp.ordertotal) + 1;
      tcomp.save(function(err, csuc) {
        if (err) console.log('error saving company')
        console.log('saved ' + csuc.name);
      });
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
        try {
          order.formateddate = moment(order.scheduledate).format("YYYY-MM-DD");
        } catch (err) {
          order.formateddate = "error in prod";
        }

        mailOrder(res, order, tcomp, next);

        return res.render('onlinepricing/thanks', {
          order: order,
          comp: tcomp
        });
      });
    }
  });
}

function mailOrder(res, order, tcomp, next) {
  res.mailer.send('mailer/order_sent', {
    from: 'no-reply@axample.com',
    to: order.email,
    subject: 'Your Upcoming Cleaning Details',
    order: order,
    comp: tcomp
  }, function(err) {
    if (err) return next(err);
  });
}

// exports.pricesetting = function(req, res) {
//   res.render('companies/onlinepricing');
// }

// Validations for user objects upon user update or create
exports.onlinePricingValidations = function(req, res, next) {
  //console.log('pricingvalidations hit 34 ');
  console.log('q' + req.body);
  console.log('s' + res.body);
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
  var validationErrors = req.validationErrors() || [];
  //if (req.body.password != req.body.passwordConfirmation) validationErrors.push({msg:"Password and password confirmation did not match."});
  if (validationErrors.length > 0) {
    //console.log('val errors= '+validationErrors.length);
    validationErrors.forEach(function(e) {
      console.log(e.msg);
      req.flash('error', e.msg);
    });
    return res.redirect("/badorder");
  } else console.log('nexting with ' + res.body);
  next();
}

function setGVars(key, res) {

  console.log('started updateordertotal');
  Company.findOne({
    key: key
  }, function(err, company) {
    if (err) return next(err);
    //if(!comp) return next(err);
    if (!company) {
      return res.redirect('/badorder');
    } else {
      console.log('comp -= comp name ' + company.name);
      comp = company;
    }
    console.log('here i am ' + comp.name);

  });

  OnlinePrice.findOne({
    key: key
  }, function(err, onlieprice) {
    if (err) return next(err);
    //if(!comp) return next(err);
    if (!onlieprice) {
      return res.redirect('/badorder');
    } else {
      console.log('onlieprice -= onlieprice name ' + onlieprice.name);
      op = onlieprice;
    }
    //console.log('here i am '+ comp.name);

  });
}

exports.show_order = function(req, res, next) {

  var tcomp;
  var torder;
  Company.findOne({
    key: req.params.id
  }, function(err, company) {
    if (err) return next(err);
    //if(!comp) return next(err);
    if (!company) {
      return res.redirect('/badorder');
    } else {

      if (err && err.code == 11000) {
        var duplicatedAttribute = err.err.split("$")[1].split("_")[0];
        req.flash('error', "That " + duplicatedAttribute + " is already in use.");
      }
      if (err) return next(err);
      tcomp = company;
      console.log(req.params.id);
      console.log(req.params.num);
      Order.findOne({
        companyid: req.params.id,
        ordernumber: req.params.num
      }, function(err, order) {
        if (err) return next(err);
        //if(!comp) return next(err);
        if (!order) {
          return res.redirect('/badorder');
        } else {
          order.services = JSON.parse(order.services);
          order.services_totals = JSON.parse(order.services_totals);
          order.showNumber = parseInt(order.ordernumber) + 3000;
          try {
            order.formateddate = moment(order.scheduledate).format("YYYY-MM-DD");
          } catch (err) {
            order.formateddate = "error in prod";
          }
          return res.render('onlinepricing/thanks', {
            order: order,
            comp: tcomp
          });
        }
      });
    }
  });
}