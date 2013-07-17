var mongoose = require('mongoose')
  , User = mongoose.model('User')
  , Company = mongoose.model('Company');

 exports.fetch = function (req, res){
 	var url = require('url');
	var url_parts = url.parse(req.url, true);
	var query = url_parts.query;
	console.log(req.name);
	console.log(req.id);
	console.log(req.params.id)
	console.log('query = '+ req.params[0]);
 	res.render('onlinepricing/', { key:req.params.id });
 }
