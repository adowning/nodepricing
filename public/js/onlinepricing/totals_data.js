var abandonmentlist = new Array();
var exitpagelist = new Array();
var temp;

$(document).ready(function() {
	console.log('start');
	var companykey = "test";
	async.series({
			one: function(callback) {
				// setParameters();
				console.log('one');
				callback(null, 1);

			},
			two: function(callback) {

				$.ajax({
					url: "/onlinepricing_gettotalsdata",
					type: "GET",
					dataType: "json",
					//data: JSON.stringify(companykey),
					contentType: "application/json",
					cache: false,
					multiple: true,
					timeout: 5000,
					complete: function(data) {
						callback(null, 1);
					},
					success: function(data) {
						for (var i = 0; i < data.data.length; i++) {
							var object = data.data[i];
							abandonmentlist.push(object);
						}
					},
					error: function() {
						console.log('er');
					}
				});

			},
			three: function(callback) {
				createCharts();
			},
			four: function(callback) {
				// $.ajax({
				//     url: "/js/onlinepricing/pricing_style.js",
				//     dataType: 'script',
				//     async: false
				// });

				// $.ajax({
				//     url: "http://zipcodedistanceapi.redline13.com/rest/js-TxGYdH8rWGzmMCcUp5CR0rICKGeEQC3KaKInsRPoyoLk0Yeq4Qh4i0H3GVHxyLhI/radius.json/75701/30/mile",
				//     success: function(some) {
				//         // $.each(some, function(index, element) {
				//         //     validzipcodelist = element;
				//         // });
				//         validzipcodelist = some;
				//     },
				//     complete: function(some) {
				//         //validzipcodelist = "comp";
				//     },
				//     error: function(err) {
				//         validzipcodelist = "err";
				//     },
				//     dataType: "json",
				//     async: false
				// });

				// callback(null, 1);
			},
			five: function(callback) {


				// $.ajax({
				//     url: "/js/onlinepricing/pricing_location.js",
				//     dataType: 'script',
				//     async: false
				// });



				// callback(null, 1);
			},
			six: function(callback) {
				// $.ajax({
				//     url: "/js/onlinepricing/pricing_script.js",
				//     dataType: 'script',
				//     async: false
				// });
				// callback(null, 1);
			}
		},
		function(err, results) {
			console.log('error ' + err).
			console.log('results ' + results);
		});
});

function createCharts() {
	var paper = Raphael("pie");
	var zipcodetotal = 0;
	var completedtotal = 0;
	var pricingtotal = 0;
	var contactformtotal = 0;
	var scheduleformtotal = 0;

	for (var i = 0; i < abandonmentlist.length; i++) {
		var object = abandonmentlist[i];
			if(object.exitpage == "zipcode"){
				zipcodetotal++;
			}
			if(object.exitpage == "completed"){
				completedtotal++;
			}
						if(object.exitpage == "pricing"){
				pricingtotal++;
			}
			if(object.exitpage == "scheduleform"){
				scheduleformtotal++;
			}
						if(object.exitpage == "contactform"){
				contactformtotal++;
			}
	}
	var values = [zipcodetotal, pricingtotal, scheduleformtotal, contactformtotal, completedtotal];
	var legend = [zipcodetotal +" Zipcode", pricingtotal + " Pricing", scheduleformtotal + " Schedule Form", contactformtotal + " Contact Form", completedtotal +" Completed"];

	paper.piechart(
		100, // pie center x coordinate
		100, // pie center y coordinate
		90, // pie radius
		values, {
			legend: legend
		}
	);
}