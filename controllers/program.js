var mongoose = require('mongoose')
  , User = mongoose.model('User')
  , Company = mongoose.model('Company')
  , passport = require('passport');


exports.getmycompany = function(req, res, next){
	var user = req.user;
	console.log(user.username);
    Company.findOne({ownername:user.username}, function(err, comp){
    if(err) return next(err);
    //if(!comp) return next(err);
    if(!comp){
      return res.redirect('/cregister');
    }else{
      res.render('program/index',{
      comp:comp
    });
   }
    }
    );

  }

exports.gettables = function(req, res, next){

      res.render('program/tables',{
     
    });


  }

exports.getinvoice = function(req, res, next){

      res.render('program/invoice',{
     
    });


  }

exports.getwidgets = function(req, res, next){

      res.render('program/widgets',{
     
    });


  }
  exports.gettesterbody = function(req, res, next){

      res.render('program/testerbody',{
     
    });


  }