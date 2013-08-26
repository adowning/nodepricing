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

exports.fetch = function (req, res) {
    var key = req.params.id;
    //setGVars(key, res);
    OnlinePrice.findOne({
        key: key
    }, function (err, pricing) {
        if (err) return next(err);
        if (!pricing) {
            return res.redirect('/badkey');
        } else {
            //op = pricing;
            res.render('onlinepricing/', {
                pricing: pricing
                //comp: comp
            });
        }
    });
}

exports.fetchSettings = function (req, res) {
    console.log('updating availability');
    var user = req.user;
    //var comp;
    console.log(user.username);
    Company.findOne({
        ownername: user.username
    }, function (err, company) {
        if (err) console.log(err);
        if (!company) {
            console.log('comp not found');
            req.flash('error', "Cannot find your company");
            return res.redirect('onlinepricing/settings');
        }
        OnlinePrice.findOne({
            key: company.key
        }, function (err, op) {
            if (!op) {
                req.flash('error', "Cannot find your pricing model");
                return res.redirect('/badkey');
            }

            res.render('onlinepricing/settings', {
                pricing: op,
                comp: company
            });
        });
    });

}

exports.changeavailability = function (req, res, next) {
    console.log('changing availability');
    console.log(req.body);
    var bs = req.body

    var user = req.user;
    Company.findOne({
        ownername: user.username
    }, function (err, company) {
        if (err) console.log(err);
        if (!company) {
            console.log('comp not found');
            req.flash('error', "Cannot find your company");
            return res.redirect('updateavailability');
        }
        OnlinePrice.findOne({
            key: company.key
        }, function (err, op) {
            if (!op) {
                req.flash('error', "Cannot find your pricing model");
                return res.redirect('/badkey');
            }

            // op.bookedslots = JSON.parse(bs);
            op.bookedslots = bs;
            op.save(function (err, opsuc) {
                if (err) console.log('error saving price')
                console.log('saved with slots: ' + opsuc.bookedslots);
                return res.redirect('updateavailability');
            });
        });
    });
}

exports.getonlinepricing = function (req, res, next) {
    console.log('getting onlinepriceing from ' + req.path);
    console.log(req.body);

    if (req.path == '/updateavailability') {
        var user = req.user;
        //var comp;
        console.log(user.username);
        Company.findOne({
            ownername: user.username
        }, function (err, company) {
            if (err) console.log(err);
            if (!company) {
                console.log('comp not found');
                req.flash('error', "Cannot find your company");
                return res.redirect('onlinepricing/settings');
            }
            OnlinePrice.findOne({
                key: company.key
            }, function (err, op) {
                if (!op) {
                    req.flash('error', "Cannot find your pricing model");
                    return res.redirect('/badkey');
                }

                res.contentType('json');
                res.send({
                    some: op
                    //comp: comp
                });

            });
        });
    }

    if (req.path == '/onlinepricing') {
        console.log(req.body);
        console.log(req.body[0]);
        //console.log('key -- '+JSON.parse(req.body));
        OnlinePrice.findOne({
            key: req.body[0]
        }, function (err, op) {
            if (!op) {
                req.flash('error', "Cannot find your pricing model");
                return res.redirect('/badkey');
            }

            res.contentType('json');
            res.send({
                some: op
                //comp: comp
            });

        });
    }
}

exports.createorder = function (req, res, next) {
    var tcomp;
    var bookedslots;
    Company.findOne({
        key: req.params.id
    }, function (err, company) {
        if (err) return next(err);
        //if(!comp) return next(err);
        if (!company) {
            return res.redirect('/badorder');
        } else {
            tcomp = company;




        OnlinePrice.findOne({
            key: req.params.id
        }, function (err, op) {
            if (!op) {
                console.error('error saving new key');
            }

            console.log(req.body.dt);
            op.bookedslots.push(req.body.dt)
            op.save( function (err, opsuc){
                if(err) console.error(err);
                console.log('saved op');
            });

        });



            var newOrder = new Order(req.body);
            //var ordernumber = newOrder.findOrderCountForCompany(req.params.id);
            ////console.log('on '+ordernumber);
            newOrder.companyid = req.params.id;
            
            //newOrder.ordernumber = parseInt(tcomp.ordertotal) + 1;
            var newnumber = parseInt(tcomp.ordertotal) + 1;
            newOrder.ordernumber = pad(newnumber, 4);
            tcomp.ordertotal = newnumber;
            tcomp.save(function (err, csuc) {
                if (err) console.log('error saving company')
                console.log('saved ' + csuc.name);
            });

            newOrder.save(function (err, order) {
                if (err && err.code == 11000) {
                    //console.log('duped atrib-prereg = '+ err.err);
                    var duplicatedAttribute = err.err.split("$")[1].split("_")[0];
                    //console.log('duped atrib = '+ duplicatedAttribute);
                    req.flash('error', "That " + duplicatedAttribute + " is already in use.");
                    //console.log('returning req.flash '+req.flash);
                    //return res.render('users/new', {user : newUser, errorMessages: req.flash('error')});
                }
                if (err) return next(err);
                req.flash('success', "Order created successfully!");
                var result = JSON.parse(order.services);
                ////console.log(result.plugin);
                order.services = result;
                var result2 = JSON.parse(order.services_totals);
                order.services_totals = result2;
                order.showNumber = newOrder.ordernumber;
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
    }, function (err) {
        if (err) return next(err);
    });
    res.mailer.send('mailer/order_sent_company', {
        from: order.email,
        to: tcomp.publicemail,
        subject: 'New Order Received !!',
        order: order,
        comp: tcomp
    }, function (err) {
        if (err) return next(err);
    });

}

// Validations for user objects upon user update or create
exports.onlinePricingValidations = function (req, res, next) {
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
        validationErrors.forEach(function (e) {
            console.log(e.msg);
            req.flash('error', e.msg);
        });
        return res.redirect("/badorder");
    } else console.log('nexting with ' + res.body);
    next();
}

// function setGVars(key, res) {

//   console.log('setting gvars');
//   Company.findOne({
//     key: key
//   }, function(err, company) {
//     if (err) return next(err);
//     //if(!comp) return next(err);
//     if (!company) {
//       return res.redirect('/badorder');
//     } else {
//       console.log('comp -= comp name ' + company.name);
//       comp = company;
//     }
//   });

//   OnlinePrice.findOne({
//     key: key
//   }, function(err, onlineprice) {
//     if (err) return next(err);
//     //if(!comp) return next(err);
//     if (!onlineprice) {
//       return res.redirect('/badorder');
//     } else {
//       //console.log('onlieprice -= onlieprice name ' + onlieprice.name);
//       op = onlineprice;
//     }
//   });
// }

exports.show_order = function (req, res, next) {

    var tcomp;
    var torder;
    Company.findOne({
        key: req.params.id
    }, function (err, company) {
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
            Order.findOne({
                companyid: req.params.id,
                ordernumber: req.params.num
            }, function (err, order) {
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

exports.updateAvailability = function (req, res, next) {

    var user = req.user;
    console.log('updating availability for ' + user.name);
    Company.findOne({
        ownername: user.username
    }, function (err, comp) {
        if (!comp) {
            req.flash('error', "Cannot find your company");
            return res.redirect('/onlinpricing/updateavailability');
        }
    });
    OnlinePrice.findOne({
        key: comp.key
    }, function (err, op) {
        if (!op) {
            req.flash('error', "Cannot find your pricing model");
            return res.redirect('/onlinpricing/updateavailability');
        }
    });
    op.bookedslots.set(req.body);
    op.save(function (err, op) {
        //console.log(op.name);
        // Uniqueness and Save Validations

        if (err && err.code == 11001) {
            var duplicatedAttribute = err.err.split("$")[1].split("_")[0];
            req.flash('error', "That " + duplicatedAttribute + " is already in use.");
            return res.redirect('/onlinpricing/settings');
        }
        if (err) return next(err);
        req.flash('success', "Availibity updated successfully.");
        return res.redirect('/onlinepricing/settings');
    });
}

function pad(a,b){return(1e15+a+"").slice(-b)};