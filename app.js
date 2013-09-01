// Module Dependencies and Setup

var express = require('express')
  , mongoose = require('mongoose')
  , UserModel = require('./models/user')
  , OnlinePriceModel = require('./models/onlineprice')
  , CompanyModel = require('./models/company')
  , OrderModel = require('./models/order')
  , User = mongoose.model('User')
  , OnlinePrice = mongoose.model('OnlinePrice')
  , Company = mongoose.model('Company')
  , Order = mongoose.model('Order')
  , welcome = require('./controllers/welcome')
  , program = require('./controllers/program')
  , companies = require('./controllers/companies')
  , users = require('./controllers/users')
  , onlinepricing = require('./controllers/onlinepricing')
  , orders = require('./controllers/onlinepricing')
  , http = require('http')
  , path = require('path')
  , moment = require('moment')
  , engine = require('ejs-locals')
  , flash = require('connect-flash')
  , passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , expressValidator = require('express-validator')
  , mailer = require('express-mailer')
  , config = require('./config')
  , app = express();

app.engine('ejs', engine);
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(expressValidator);
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(flash());
app.use(moment());
app.use(passport.initialize());
app.use(passport.session());

// Helpers

app.use(function(req, res, next){
  app.locals.userIsAuthenticated = req.isAuthenticated(); // check for user authentication
  app.locals.user = req.user; // make user available in all views
  app.locals.errorMessages = req.flash('error'); // make error alert messages available in all views
  app.locals.successMessages = req.flash('success'); // make success messages available in all views
  app.locals.layoutPath = "../shared/layout";
  next();
});

// Mailer Setup

mailer.extend(app, {
  from: 'no-reply@example.com',
  host: 'smtp.mandrillapp.com', // hostname
  // secureConnection: true, // use SSL
  port: 587, // port for Mandrill
  transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts
  auth: {
    user: config[app.get('env')].MANDRILL_USERNAME,
    pass: config[app.get('env')].MANDRILL_API_KEY
  }
});

// Routing Initializers

app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);

// Error Handling

if ('development' == app.get('env')) {
  app.use(express.errorHandler());
} else {
  app.use(function(err, req, res, next) {
    res.render('errors/500', { status: 500 });
  });
}

// Database Connection

if ('development' == app.get('env')) {
  mongoose.connect('mongodb://localhost/bubblepop');
} else {
  //mongodb:draive:blue42@mongo.onmodulus.net:27017/Revusi2b
  //mongoose.connect('mongodb://draive:blue42@mongo.onmodulus.net:27017/Revusi2b');
  mongoose.connect('mongodb://draive:sugarlips42@ds043348.mongolab.com:43348/heroku_app17863296');
}

// Authentication

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) return done(err);
      if (!user) return done(null, false, { message: "Sorry, we don't recognize that username." });
      user.validPassword(password, function(err, isMatch){
        if(err) return done(err);
        if(isMatch) return done(null, user);
        else done(null, false, { message: 'Incorrect password.' });
      });
    });
  }
));

function ensureAuthenticated(req, res, next){
  console.log('>>> ensuring authentication');
  if (req.isAuthenticated()) return next();
  req.flash('error', 'Please sign in to continue.');
  var postAuthDestination = req.url;
  res.redirect('/login?postAuthDestination='+postAuthDestination);
}

function redirectAuthenticated(req, res, next){
  if (req.isAuthenticated()) return res.redirect('/');
  next();
}

// Routing

app.get('/', welcome.index);
app.get('/onlinepricing/:id', onlinepricing.fetch);
app.get('/showorder/:id/:num', onlinepricing.show_order);
//app.get('onlinepricing/thanks', onlinepricing.thanks);
app.post('/onlinepricing', onlinepricing.getonlinepricing);
app.post('/changeavailability', onlinepricing.changeavailability);
app.get('/updateavailability', ensureAuthenticated, onlinepricing.fetchSettings);
app.post('/updateavailability', onlinepricing.getonlinepricing);
app.post('/createonlineprice/:id', onlinepricing.onlinePricingValidations, onlinepricing.createorder);
app.get('/login', redirectAuthenticated, users.login);
app.get('/reset_password', redirectAuthenticated, users.reset_password);
app.post('/reset_password', redirectAuthenticated, users.generate_password_reset);
app.get('/password_reset', redirectAuthenticated, users.password_reset);
app.post('/password_reset', redirectAuthenticated, users.process_password_reset);
app.post('/login', redirectAuthenticated, users.authenticate);
app.get('/register', redirectAuthenticated, users.register);
app.post('/register', redirectAuthenticated, users.userValidations, users.create);
app.get('/account', ensureAuthenticated, users.account);
app.post('/account', ensureAuthenticated, users.userValidations, users.update);
app.get('/dashboard', ensureAuthenticated, users.dashboard);
app.get('/logout', users.logout);
app.get('/users', ensureAuthenticated, users.list); // for illustrative purposes only
app.get('/program', ensureAuthenticated, program.getmycompany);
app.get('/cregister', ensureAuthenticated, companies.register);
app.post('/cregister', ensureAuthenticated, companies.companyValidations, companies.create);
app.get('/editcompany', ensureAuthenticated, companies.account);
app.post('/editcompany', ensureAuthenticated, companies.companyValidations, companies.update);
//app.get('/pricesettings', ensureAuthenticated, companies.pricesetting);
app.all('*', welcome.not_found);




// Start Server w/ DB Connection

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
  });
});

//show company keys
Company.find(function(err, companies) {
  if (err) console.log('er: ' + err);
  for (var i = 0; i < companies.length; i++) {
    console.log(companies[i].key);
  }
})



// app.use(function (req, res, next){
//    res.locals.scripts = ['/js/onlinepricing/pricing_script.js', '/js/date2.js']
//    next();
// });

//Time formating thing
//var moment = require('moment');
//console.log(moment("05-06-1995", ["MM-DD-YYYY", "DD-MM-YYYY"]));

