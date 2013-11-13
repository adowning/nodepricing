var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    OnlinePrice = mongoose.model('OnlinePrice'),
    Order = mongoose.model('Order'),
    Abandonment = mongoose.model('Abandonment'),
    Company = mongoose.model('Company'),
    async = require("async"),
    moment = require('moment');

exports.gettripcharges = function(req, res) {
    console.log('>>>>>>>>>>>>>>>>sup homie');
    var user = req.user;
    //var ab2 = ["Half off tile protector", "%20 off carpet protector", "%15 off upholstery cleaning"];
    var opr;
    var thiskey;
    var monthlytotals = new Object();

                Company.findOne({
                    ownername: user.username
                }, function(err, company) {
                    if (err) console.log(err);
                    if (!company) {
                        console.log('comp not found');
                        req.flash('error', "Cannot find your company");
                        return res.redirect('onlinepricing/settings');
                    }
                    OnlinePrice.find({
                        key: company.key
                    }, function(err, opr) {
                        if (!opr) {
                            req.flash('error', "Cannot find your pricing model");
                            return res.redirect('/badkey');
                        }
                        var tcs = opr.tripcharges;
                        res.render('onlinepricing/edit_tripcharges', {
                            tripcharges: tcs
                        });
                         
                    });
                });


   
};

exports.getservicecategories = function(req, res) {
    console.log('>>>>>>>>>>>>>>>>sup homie');
    var user = req.user;
    var opr;
    var thiskey;
    var monthlytotals = new Object();

                Company.findOne({
                    ownername: user.username
                }, function(err, company) {
                    if (err) console.log(err);
                    if (!company) {
                        console.log('comp not found');
                        req.flash('error', "Cannot find your company");
                        return res.redirect('onlinepricing/settings');
                    }
                    OnlinePrice.find({
                        key: company.key
                    }, function(err, opr) {
                        if (!opr) {
                            req.flash('error', "Cannot find your pricing model");
                            return res.redirect('/badkey');
                        }
                        var srs = opr.services;
                        res.render('onlinepricing/edit_servicecategories', {
                            services: srs
                        });
                         
                    });
                });

    // async.series({
    //         one: function(callback) {
    //             console.log('1');
    //             Company.findOne({
    //                 ownername: user.username
    //             }, function(err, company) {
    //                 if (err) console.log(err);
    //                 if (!company) {
    //                     console.log('comp not found');
    //                     req.flash('error', "Cannot find your company");
    //                     return res.redirect('onlinepricing/settings');
    //                 }
    //                 OnlinePrice.find({
    //                     key: company.key
    //                 }, function(err, opr) {
    //                     if (!ab) {
    //                         req.flash('error', "Cannot find your pricing model");
    //                         return res.redirect('/badkey');
    //                     }
    //                     var srs = opr.services;
    //                     console.log('1.5');
    //                     // res.send({
    //                     //     services: srs
    //                     // });
    //                     res.render('onlinepricing_editservicecategories', {
    //                         services: srs
    //                     });
    //                     callback(null, 1);
    //                 });
    //             });
    //         },
    //         function(err, results) {
    //             console.log(results);
    //         }});

   
};

    exports.getTotalsGetData = function(req, res) {

        var user = req.user;
        var ab2 = ["Half off tile protector", "%20 off carpet protector", "%15 off upholstery cleaning"];
        var abans;
        var thiskey;
        var monthlytotals = new Object();

        async.series({
                one: function(callback) {
                    console.log('1');
                    Company.findOne({
                        ownername: user.username
                    }, function(err, company) {
                        if (err) console.log(err);
                        if (!company) {
                            console.log('comp not found');
                            req.flash('error', "Cannot find your company");
                            return res.redirect('onlinepricing/settings');
                        }
                        Abandonment.find({
                            key: company.key
                        }, function(err, ab) {
                            if (!ab) {
                                req.flash('error', "Cannot find your pricing model");
                                return res.redirect('/badkey');
                            }
                            console.log('1.5');
                            abans = ab;
                            thiskey = company.key;
                            callback(null, 1);
                        });
                    });


                },
                two: function(callback) {
                    console.log('2');
                    Order.find({
                        companyid: thiskey
                    }, function(err, orders) {
                        if (!orders) {
                            req.flash('error', "Cannot find your pricing model");
                            return res.redirect('/badkey');
                        }
                        monthlytotals = getMonthlyTotals(orders);
                        callback(null, 2);
                    });


                },
                three: function(callback) {
                    console.log('3');
                    console.log(monthlytotals);
                    res.contentType('json');
                    res.send({
                        data: abans,
                        data2: monthlytotals
                    });
                    callback(null, 3);
                }
            },
            function(err, results) {
                console.log(results);
            });

    }

    function getMonthlyTotals(orders) {
        console.log('gettingmonthly' + orders.length);
        var month;
        var entry;
        var entrylist = new Array();
        var months = new Array();
        months[0] = "January";
        months[1] = "February";
        months[2] = "March";
        months[3] = "April";
        months[4] = "May";
        months[5] = "June";
        months[6] = "July";
        months[7] = "August";
        months[8] = "September";
        months[9] = "October";
        months[10] = "November";
        months[11] = "December";
        var jan = 0,
            feb = 0,
            mar = 0,
            apr = 0,
            may = 0,
            jun = 0,
            jul = 0,
            aug = 0;
        sept = 0, oct = 0, nov = 0, dec = 0;

        for (var i = 0; i < orders.length; i++) {
            month = months[orders[i].createdAt.getMonth()];
            // if(entrylist.contains)
            // entry.month = month;
            // entry.total = orders[i].servicestotals;
            // if(month == "September"){
            //     console.log(JSON.parse(orders[i].services_totals).subtotal);
            //     sept += parseInt(JSON.parse(orders[i].services_totals).subtotal);
            // }
            switch (month) {
                case "January":
                    jan += parseInt(JSON.parse(orders[i].services_totals).subtotal);
                    break;
                case "February":
                    feb += parseInt(JSON.parse(orders[i].services_totals).subtotal);
                    break;
                case "March":
                    mar += parseInt(JSON.parse(orders[i].services_totals).subtotal);
                    break;
                case "April":
                    apr += parseInt(JSON.parse(orders[i].services_totals).subtotal);
                    break;
                case "May":
                    may += parseInt(JSON.parse(orders[i].services_totals).subtotal);
                    break;
                case "June":
                    jun += parseInt(JSON.parse(orders[i].services_totals).subtotal);
                    break;
                case "July":
                    jul += parseInt(JSON.parse(orders[i].services_totals).subtotal);
                    break;
                case "August":
                    aug += parseInt(JSON.parse(orders[i].services_totals).subtotal);
                    break;
                case "September":
                    sept += parseInt(JSON.parse(orders[i].services_totals).subtotal);
                    break;
                case "October":
                    oct += parseInt(JSON.parse(orders[i].services_totals).subtotal);
                    break;
                case "November":
                    nov += parseInt(JSON.parse(orders[i].services_totals).subtotal);
                    break;
                case "December":
                    dec += parseInt(JSON.parse(orders[i].services_totals).subtotal);
                    break;
                default:
                    console.log('error! ' + month);
            }


        }
        var tarray = new Array();
        tarray.push(jan);
        tarray.push(feb);
        tarray.push(mar);
        tarray.push(apr);
        tarray.push(may);
        tarray.push(jun);
        tarray.push(jul);
        tarray.push(aug);
        tarray.push(sept);
        tarray.push(oct);
        tarray.push(nov);
        tarray.push(dec);
        //console.log(tarray);
        return tarray;
    }
    exports.getTotals = function(req, res) {
        console.log('getting totals');
        var user = req.user;
        var op;
        var ab;
        var od;
        console.log(user.username);
        Company.findOne({
            ownername: user.username
        }, function(err, company) {
            if (err) console.log(err);
            if (!company) {
                console.log('comp not found');
                req.flash('error', "Cannot find your company");
                return res.redirect('onlinepricing/settings');
            }
            OnlinePrice.findOne({
                key: company.key
            }, function(err, opr) {
                if (!opr) {
                    console.log('bad onlineprice key ' + company.key);
                    req.flash('error', "Cannot find your pricing model");
                    return res.redirect('/badkey');
                }
                op = opr;

                Abandonment.find({
                    key: company.key
                }, function(err, abr) {
                    if (!abr) {
                        console.log('bad abandonement key ' + company.key);
                        req.flash('error', "Cannot find your abandonemnt model");
                        return res.redirect('/badkey');
                    }
                    ab = abr;

                    Order.find({
                        companyid: company.key
                    }, function(err, odr) {
                        if (!odr) {
                            console.log('bad order key ' + company.key);
                            req.flash('error', "Cannot find your order model");
                            return res.redirect('/badkey');
                        }
                        od = odr;
                        res.render('onlinepricing/totals', {
                            pricing: op,
                            comp: company,
                            orders: od,
                            abandonments: ab
                        });

                    });
                });
            });
        });
    }

    exports.saveAbandonment = function(req, res) {

        var exitpage_key = req.body;
        var exitpage = exitpage_key[1];
        var key = exitpage_key[0];
        var thiscompany = "hai2u";

        Company.findOne({
            key: key
        }, function(err, company) {
            if (err) console.log(err);
            if (!company) {
                console.log('comp not found');
                //req.flash('error', "Cannot find your company");
                //return res.redirect('onlinepricing/fuck');
                return false;
            }

            thiscompany = company;
        });
        if (thiscompany) {

            var newAbandonment = new Abandonment();
            newAbandonment.exitpage = exitpage;
            newAbandonment.key = key;

            newAbandonment.save(function(err, aban) {

                // Uniqueness and save validations
                debugger;
                if (err && err.code == 11000) {
                    var duplicatedAttribute = err.err.split("$")[1].split("_")[0];
                    req.flash('error', "That " + duplicatedAttribute + " is already in use.");
                    debugger;
                    return {
                        aban: newAbandonment,
                        errorMessages: req.flash('error')
                    };
                    // return res.render('companies/new', {
                    //   aban: newAbandonment,
                    //   errorMessages: req.flash('error')
                    // });
                    //}
                    // if (err) return next(err);
                    //return res.redirect('/program');
                };

                // }else{
                //     console.log('companynotfound');
                // }

            });
        }
    };
    exports.fetch = function(req, res) {
        var key = req.params.id.substring(0, 16);
        var tester = "sugarlips";
        //setGVars(key, res);
        OnlinePrice.findOne({
            key: key
        }, function(err, pricing) {
            var tester2 = "sugarlips";
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

    exports.fetchSettings = function(req, res) {
        console.log('updating availability');
        var user = req.user;
        //var comp;
        console.log(user.username);
        Company.findOne({
            ownername: user.username
        }, function(err, company) {
            if (err) console.log(err);
            if (!company) {
                console.log('comp not found');
                req.flash('error', "Cannot find your company");
                return res.redirect('onlinepricing/settings');
            }
            OnlinePrice.findOne({
                key: company.key
            }, function(err, op) {
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

    exports.changebasicsettings = function(req, res, next) {
        console.log('changing basicsettings');
        var settings = req.body
        // if (req.path == '/changeavailabilityx') {
        //     console.log('heyas');
        // }
        var user = req.user;
        Company.findOne({
            ownername: user.username
        }, function(err, company) {
            if (err) console.log(err);
            if (!company) {
                console.log('comp not found');
                req.flash('error', "Cannot find your company");
                return res.redirect('updateavailability');
            }
            OnlinePrice.findOne({
                key: company.key
            }, function(err, op) {
                if (!op) {
                    req.flash('error', "Cannot find your company model");
                    return res.redirect('/badkey');
                }
                key = settings[0];
                value = settings[1];
                updateBasicCompanySettings(key, value, company, req, res);
            });
        });
    }

    exports.changeavailability = function(req, res, next) {
        console.log('changing availability');
        var bs = req.body
        var user = req.user;
        Company.findOne({
            ownername: user.username
        }, function(err, company) {
            if (err) console.log(err);
            if (!company) {
                console.log('comp not found');
                req.flash('error', "Cannot find your company");
                return res.redirect('updateavailability');
            }
            OnlinePrice.findOne({
                key: company.key
            }, function(err, op) {
                if (!op) {
                    req.flash('error', "Cannot find your pricing model");
                    return res.redirect('/badkey');
                }

                // op.bookedslots = JSON.parse(bs);
                op.bookedslots = bs;
                op.save(function(err, opsuc) {
                    if (err) console.log('error saving price')
                    console.log('saved with slots: ' + opsuc.bookedslots);
                    return res.redirect('updateavailability');
                });
            });
        });
    }

    exports.getonlinepricing = function(req, res, next) {
        console.log('getting onlinepriceing from ' + req.path);
        //var key = req.params.id.substring(0,16);
        var bs = req.body;
        if (req.path == '/updateavailability') {
            var user = req.user;
            console.log(user.username);
            Company.findOne({
                ownername: user.username
            }, function(err, company) {
                if (err) console.log(err);
                if (!company) {
                    console.log('comp not found');
                    req.flash('error', "Cannot find your company");
                    return res.redirect('onlinepricing/settings');
                }
                OnlinePrice.findOne({
                    key: company.key
                }, function(err, op) {
                    if (!op) {
                        req.flash('error', "Cannot find your pricing model");
                        return res.redirect('/badkey');
                    }
                    if (bs[0] == 'bs') {
                        console.log('hit');
                        res.contentType('json');
                        res.send({
                            data: company
                            //comp: comp
                        });
                    } else {
                        res.contentType('json');
                        res.send({
                            some: op
                            //comp: comp
                        });
                    }
                });
            });
        }

        if (req.path == '/onlinepricing') {
            OnlinePrice.findOne({
                key: req.body[0]
            }, function(err, op) {
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

    exports.createorder = function(req, res, next) {
        var tcomp;
        var bookedslots;
        Company.findOne({
            key: req.params.id
        }, function(err, company) {
            if (err) return next(err);
            //if(!comp) return next(err);
            if (!company) {
                return res.redirect('/badorder');
            } else {
                tcomp = company;



                OnlinePrice.findOne({
                    key: req.params.id
                }, function(err, op) {
                    if (!op) {
                        console.error('error saving new key');
                    }

                    op.save(function(err, opsuc) {
                        if (err) console.error(err);
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
        var email;
        var thiskey = tcomp.key;
        console.log('1' + thiskey);
        OnlinePrice.findOne({
            key: thiskey
        }, function(err, op) {
            console.log('err' + err);
            //console.log(thiskey);
            if (!op) {
                console.error('error getting online price email array');
            }
            //console.log('e'+op.email);
            email = op.email;
            if (!email) {
                console.error('error getting online price email array');
            }

            console.log('company email >>>>' + email);

            res.mailer.send('mailer/order_sent', {
                from: tcomp.publicemail,
                to: order.email,
                subject: 'Your Upcoming Cleaning Details',
                order: order,
                comp: tcomp
            }, function(err) {
                if (err) return next(err);
            });
            for (var i = 0; i < email.length; i++) {

                res.mailer.send('mailer/order_sent_company', {
                    from: order.email,
                    to: email[i],
                    subject: 'New Order Received !! for ' + order.name,
                    order: order,
                    comp: tcomp
                }, function(err) {
                    if (err) return next(err);
                });
            }



        });

    }

    // Validations for user objects upon user update or create
    exports.onlinePricingValidations = function(req, res, next) {
        //console.log('pricingvalidations hit 34 ');
        console.log('q' + req.body.scheduledate);

        var creatingorder = req.url == "/onlinepricing";
        //var updatingUser = !creatingUser; // only to improve readability
        req.assert('name', 'Name is required.').notEmpty();
        req.assert('email', 'You must provide an email address.').notEmpty();
        req.assert('telephone', 'Telephone is required.').notEmpty();
        req.assert('address', 'Address is required.').notEmpty();
        req.assert('scheduledate', 'schedule date Error').notEmpty();
        req.assert('scheduletime', 'sched time Error').notEmpty();
        req.assert('zipcode', 'zip Error').notEmpty();
        req.assert('city', 'city Error2').notEmpty();
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

    exports.updateAvailability = function(req, res, next) {

        var user = req.user;
        console.log('updating availability for ' + user.name);
        Company.findOne({
            ownername: user.username
        }, function(err, comp) {
            if (!comp) {
                req.flash('error', "Cannot find your company");
                return res.redirect('/onlinpricing/updateavailability');
            }
        });
        OnlinePrice.findOne({
            key: comp.key
        }, function(err, op) {
            if (!op) {
                req.flash('error', "Cannot find your pricing model");
                return res.redirect('/onlinpricing/updateavailability');
            }
        });
        op.bookedslots.set(req.body);
        op.save(function(err, op) {
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

    function pad(a, b) {
        return (1e15 + a + "").slice(-b)
    };

    function updateBasicCompanySettings(key, value, company, req, res) {
        switch (key) {
            case "Company Name":
                company.name = value;
                saveCompany(company);
                return;
            case "Company Slogan":
                company.slogan = value;
                saveCompany(company);
                return;
            case "Website":
                company.url = value;
                saveCompany(company);
                return;
            case "Address":
                company.address = value;
                saveCompany(company);
                return;
            case "Zipcode":
                company.zipcode = value;
                saveCompany(company);
                return;
            case "City":
                company.city = value;
                saveCompany(company);
                return;
            case "State":
                company.state = value;
                saveCompany(company);
                return;
            case "Telephone":
                company.telephone = value;
                saveCompany(company);
                return;
            case "Public Email":
                company.publicemail = value;
                saveCompany(company);
                return;
            case "Tax Rate":
                company.tax = value;
                saveCompany(company);
                return;
            case "Service Radius (miles from zipcode)":
                company.radius = value;
                saveCompany(company);
                return;
            default:
                console.log('ERROR bad key')
        }
    }

    function saveCompany(company) {
        company.save(function(err, company) {
            if (err && err.code == 11001) {
                var duplicatedAttribute = err.err.split("$")[1].split("_")[0];
                req.flash('error', "That " + duplicatedAttribute + " is already in use.");
                console.log('error');
                return res.redirect('/updateavailability');
            }
            if (err) return next(err);
            //req.flash('success', "Availibity updated successfully.");
            console.log('successs saving company');
            //return res.redirect('/updateavailability');
        });
    }