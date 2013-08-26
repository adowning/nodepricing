$(document).ready(function() {
	$('#priceNext').prop("disabled", true);
	$('#schenext').prop("disabled", true);
	$('#zipcode').val("");
	$('#timediv').hide();
	$('#zipModal').hide();
	$('#scheduleform').hide();
	$('#pricecalculator').hide();
	$('#contactform').hide();
	//clean shit
	$('#furniturelist').append('<tr><td>FURNITURE</td><td>Clean</td><td>Protect</td><td>Deodorize</td></tr>');
	$('#furniturelist').hide();
	$('#tilerooms').append('<tr><td>AREA</td><td>Clean</td><td>Seal</td></tr>');
	$('#tilerooms').hide();
	$('#discountrow').hide();
	//FEF571
	//$(".body").css({"backgroundColor": "#FEF571"});

	$("#scheduleform").css({
		"backgroundColor": "white"
	});
	$("#contactform").css({
		"backgroundColor": "white"
	});
	$("#zipcodewell").css({
		"backgroundColor": "white"
	});
	$("#pricearea").css({
		"backgroundColor": "white"
	});
	// $("#background").css({
	// 	"backgroundColor": "71C1FE"
	// });
	//fixme
		$("accordian-toggle:hover").css({
		"backgroundColor": "C1FE71"
	});
	//alert('hai'+stylesettings['primary_color']);
});