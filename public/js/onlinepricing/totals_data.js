var abandonmentlist = new Array();
var exitpagelist = new Array();
var temp;
var monthlytotals;

$(document).ready(function() {
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
					complete: function(data, data2) {
						callback(null, 1);
					},
					success: function(data) {
						console.log('s' + data.data2);
						for (var i = 0; i < data.data.length; i++) {
							var object = data.data[i];
							abandonmentlist.push(object);
						}
						monthlytotals = data.data2;
					},
					error: function() {
						console.log('er');
					}
				});

			},
			three: function(callback) {
				createAbandonChart();
				createTotalsChart();
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

function createAbandonChart() {
	var paper = Raphael("pie");
	var zipcodetotal = 0;
	var completedtotal = 0;
	var pricingtotal = 0;
	var contactformtotal = 0;
	var scheduleformtotal = 0;

	for (var i = 0; i < abandonmentlist.length; i++) {
		var object = abandonmentlist[i];
		if (object.exitpage == "zipcode") {
			zipcodetotal++;
		}
		if (object.exitpage == "completed") {
			completedtotal++;
		}
		if (object.exitpage == "pricing") {
			pricingtotal++;
		}
		if (object.exitpage == "scheduleform") {
			scheduleformtotal++;
		}
		if (object.exitpage == "contactform") {
			contactformtotal++;
		}
	}
	var values = [zipcodetotal, pricingtotal, scheduleformtotal, contactformtotal, completedtotal];
	var legend = [zipcodetotal + " Zipcode", pricingtotal + " Pricing", scheduleformtotal + " Schedule Form", contactformtotal + " Contact Form", completedtotal + " Completed"];

	paper.piechart(
		100, // pie center x coordinate
		100, // pie center y coordinate
		90, // pie radius
		values, {
			legend: legend
		}
	);
}

function createTotalsChart() {
	var bars = new Charts.BarChart('barchartx', {
		x_label_color: "#333333",
			bar_width: 	20,
			bar_spacing: 20,
		rounding: 10,
	});
	console.log('xx'+monthlytotals);
	    var months = new Array();
months[0]="Jan";
months[1]="Feb";
months[2]="Mar";
months[3]="Apr";
months[4]="May";
months[5]="Jun";
months[6]="Jul";
months[7]="Aug";
months[8]="Sep";
months[9]="Oct";
months[10]="Nov";
months[11]="Dec";
	for(var i = 0; i < monthlytotals.length; i++){
		if( (i % 2 == 0)){
			var color = "#53ba03"
		}else{
			var color = "#2f69bf"
		}
console.log(color);		
				bars.add({
		label: months[i],
		
		value: monthlytotals[i],
		options: {
			bar_color: color
		}
	});
	}


	// bars.add({
	// 	label: "moo",
	// 	value: 800,
	// 	options: {
	// 		bar_color: "#53ba03"
	// 	}
	// // });

	// bars.add({
	// 	label: "doo",
	// 	value: 300
	// });

	bars.draw();
}