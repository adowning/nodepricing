define(['pricing_data', 'async'], function (prd, async) {

	console.log('initializing servicemonster');

	var pd = prd.getOP(),
		openslots = new Array();

	var convertToMilitaryTime = function (ampm, hours, minutes) {
//		console.log(ampm)
//		console.log(hours)
//		console.log(minutes)
		var militaryHours;
		if (ampm == "am") {
			militaryHours = hours;
			// check for special case: midnight
			if (militaryHours == "12") { militaryHours = "00"; }
		} else {
			if (ampm == "pm" || ampm == "p.m.") {
				// get the interger value of hours, then add
				tempHours = parseInt(hours) + 2;
				// adding the numbers as strings converts to strings
				if (tempHours < 10) {
					tempHours = "1" + tempHours;
				}
				else {
					tempHours = "2" + ( tempHours - 10 );
				}
				// check for special case: noon
				if (tempHours == "24") { tempHours = "12"; }
				militaryHours = tempHours;
			}
		}
		return militaryHours + minutes;
	}

	return {


		addOpenToSMChecklist: function (slotstring) {
			var slotanddate = new Object();
			slotanddate.slot = slotstring.substring(5, 6);
			slotanddate.date = slotstring.substring(11, 50);

			openslots.push(slotanddate);

			return false;

		},

		checkSlotsSM: function () {
			console.log('checking slots sm')
			var SMBooks = new Array(),
				busyDates = new Array();
			var routesIDList = new Array();
			async.series({

					one: function (callback) {
						$.ajax({
							type: "GET",
							url: "https://api.servicemonster.net/v1/routes",
							contentType: "application/json; charset=utf-8",
							dataType: "json",
							beforeSend: function (xhr) {
								xhr.setRequestHeader("Authorization", "Basic ZTZleGc0Nkw6bUM0RHM5MXFnZXdPUzFv");
							},
							complete: function () {
//								console.log(routesIDList.length)
								callback(null, 1);
							},
							success: function (json) {
								for (var i = 0; i < json.items.length; i++) {
									var rname = json.items[i].name;
									if (rname == 'GREEN VAN' ||
										rname == 'BOX VAN' ||
										rname == 'TRAILOR'
										) {
										routesIDList.push(json.items[i].routeID);
									}
								}
								;
							}});

					},

					two: function (callback) {

						var startdate = Date.today().toString("MM-dd-yyyy"),
							enddate = Date.today().addDays(7).toString("MM-dd-yyyy");

						$.support.cors = true;
						$.ajax({
							type: "GET",
							url: "https://api.servicemonster.net/v1/scheduleItems?startDate=" + startdate + "&endDate=" + enddate + "",
							contentType: "application/json; charset=utf-8",
							dataType: "json",
							beforeSend: function (xhr) {
								xhr.setRequestHeader("Authorization", "Basic ZTZleGc0Nkw6bUM0RHM5MXFnZXdPUzFv");
							},
							complete: function () {
								callback(null, 2);
							},
							success: function (json) {
								for (var i = 0; i < json.items.length; i++) {
									var sdate = json.items[i].StartDateTime.substring(0, 10);
									var stime = json.items[i].StartDateTime.substring(11, 22);
									var tempstartstring = sdate + " " + stime;
									var edate = json.items[i].EndDateTime.substring(0, 10);
									var etime = json.items[i].EndDateTime.substring(11, 22);
									var tempendstring = edate + " " + etime;
									var tdate = new Object();
									tdate.startdate = Date.parse(tempstartstring);
									tdate.enddate = Date.parse(tempendstring);
									//TODO set me to define route id's to look at when scheduling off SM

//									console.log('route id = ' + json.items[i].RouteID)
//									console.log(routesIDList.length)
//									if(routesIDList.indexOf(json.items[i].RouteID) != -1){
//										console.log('your not here')
//									}else{
//										console.log('gotcha')
//									}
									if (json.items[i].ItemType == 'Job' && routesIDList.indexOf(json.items[i].RouteID) != -1) {
										SMBooks.push(tdate);
									}
									;
								}
								;

							},
							error: function (msg, url, line) {
								alert(msg);
							}
						});
					},
					three: function (callback) {
						var dailySlots = [];
						for (var i = 0; i < openslots.length; i++) {
							var s = "";
							s = pd.timeslots[openslots[i].slot]
							s = s.replace(":", "")
							s = s.replace("am", "")
							s = s.replace("pm", "")
							if (dailySlots.indexOf(s) == -1) {
								dailySlots.push(s)
							}
						}
//						console.log(dailySlots.length)
						for (var i = 0; i < dailySlots.length; i++) {
//							console.log(dailySlots[i])
						}
						for (var x = 0; x < SMBooks.length; x++) {
							for (var i = 0; i < openslots.length; i++) {
//								console.log('timeslot a '+ pd.timeslots[openslots[i].slot])
								var timeslot = convertToMilitaryTime(pd.timeslots[openslots[i].slot].substring(6, 8),
									pd.timeslots[openslots[i].slot].substring(0, 2),
									pd.timeslots[openslots[i].slot].substring(3, 5));
//								console.log('timeslot ' + timeslot)
								if (pd.browsert != "Explorer") {
									//check dates are the same first
									if (SMBooks[x].startdate.toString().substring(0, 15) ==
										openslots[i].date.substring(0, 15)) {
										//TODO here is where we are working
//										console.log(timeslot)
										var timeslotE = pd.timeslots[openslots[i].slot].replace(":", "");
//										console.log(timeslotE)
										timeslotE = timeslotE.replace("am", "")
										timeslotE = timeslotE.replace("pm", "")
//										console.log(timeslotE)
//										console.log(i)
//										console.log(i+1)
										var nx = i + 1;
//										console.log(i)
//										console.log(nx)
//										console.log(pd.timeslots[openslots[i].slot]);
//
//										console.log(pd.timeslots[openslots[nx].slot]);

//										console.log(nx)
//										console.log(openslots.length)
////										console.log(dailySlots.length)
//										console.log(timeslotE)
//										console.log('>>' + dailySlots.indexOf(timeslotE))
										var nextSloti = dailySlots.indexOf(timeslotE) + 1;
//										console.log('xx ' +dailySlots[dailySlots.indexOf(timeslotE)]);
//
//										console.log('yy ' +dailySlots[nextSloti]);
										var nextSlot = dailySlots[nextSloti];

//										if (nx < openslots.length){
//											var nextSlot =  dailySlots[nx];
////											console.log(nextSlot)
//											nextSlot = nextSlot.replace(":", "")
//											nextSlot = nextSlot.replace("am", "")
//											nextSlot = nextSlot.replace("pm", "")
//										}else
//										{
//											var nextSlot = "none";
//										}

////										console.log(SMBooks[x].startdate.toString().substring(16, 24).replace(":", ""))
										var smBookingStart = SMBooks[x].startdate.toString().substring(16, 24).replace(":", "");
										var smBookingEnd = SMBooks[x].enddate.toString().substring(16, 24).replace(":", "");
										smBookingStart = smBookingStart.slice(0, -3);
										smBookingEnd = smBookingEnd.slice(0, -3);
//										console.log(smBookingEnd)
//										console.log(smBookingStart)
//										console.log(timeslotE)
//										console.log(nextSlot)
//										console.log(smBookingStart)
//										console.log(smBookingEnd)
//										if (pd.timeslots[openslots[i].slot] >=
//										SMBooks[x].startdate.toString().substring(16, 24)){
//											console.log(pd.timeslots[openslots[i].slot] + ' is >= ' +
//											SMBooks[x].startdate.toString().substring(16, 24))
//										}

//										this is if slot is between beggining and end of sm booking
										if (timeslotE >= smBookingStart &&
											timeslotE < smBookingEnd) {
											var bdate = new Object();
											bdate.slot = openslots[i].slot;
											bdate.date = openslots[i].date.substring(0, 15);
											console.log("...."+bdate)
											busyDates.push(bdate);
										}
//										if (timeslotE <= smBookingStart &&
//											timeslotE < smBookingEnd) {
//											var bdate = new Object();
//											bdate.slot = openslots[i].slot;
//											bdate.date = openslots[i].date.substring(0, 15);
//											console.log(bdate)
//											busyDates.push(bdate);
//										}
										/////////////////////////////////////
										//TODO FROM THIS POINT ON----
										//you have to check to be sure its not already added if not it will fuck
										// up your checks when you see if something is added or not more than once
										// on routes
										////////////////////////////////////

//										this is if slot is before sm booking but start of sm booking is before next slot
										if (nextSlot) {
											if (timeslotE < smBookingStart &&
												nextSlot < smBookingEnd &&
												nextSlot > smBookingStart
												) {
//											console.log('hwdy hoe')
												var bdate = new Object();
												bdate.slot = openslots[i].slot;
												bdate.date = openslots[i].date.substring(0, 15);
												console.log(bdate)

												busyDates.push(bdate);
											}
										}
										//last slot of day
										else {
//											console.log(timeslotE)
//											console.log(parseInt(timeslotE) + 200)
//											console.log(smBookingStart)
//											console.log(smBookingEnd)
											if (timeslotE <= smBookingStart) {
//												console.log('a');
											}
//											console.log('trying b/')
//											console.log(parseInt(timeslotE) + 200)
//											console.log(smBookingEnd)
											if ((parseInt(timeslotE) + 200) <= smBookingEnd) {
//												console.log('b')
											}

											if ((parseInt(timeslotE) + 200) >= smBookingStart) {
//												console.log('c')
											}
											if (timeslotE <= smBookingStart &&
												(parseInt(timeslotE) + 200) <= smBookingEnd &&
												(parseInt(timeslotE) + 200) >= smBookingStart
												) {
//												console.log('end hit')
												var bdate = new Object();
												bdate.slot = openslots[i].slot;
												bdate.date = openslots[i].date.substring(0, 15);
//												console.log(bdate)

												busyDates.push(bdate);
											}
										}

										//old code
//										if (pd.timeslots[openslots[i].slot] >=
//											SMBooks[x].startdate.toString().substring(16, 24) &&
//											pd.timeslots[openslots[i].slot] <
//											SMBooks[x].enddate.toString().substring(16, 24)) {
//											console.log(' booking >>>> ')
//											var bdate = new Object();
//
//											bdate.slot = openslots[i].slot;
//											bdate.date = openslots[i].date.substring(0, 15);
//											busyDates.push(bdate);
//										}
									}
								} else {
									var smshort = "",
										os = "";

									if (SMBooks[x].startdate.toString().length == 27) {
										// console.log('a ' + SMBooks[x].startdate.toString().substring(0, 10) + ' ' + SMBooks[x].startdate.toString().substring(23, 27))
										sm = SMBooks[x].startdate.toString().substring(0, 10) + ' ' + SMBooks[x].startdate.toString().substring(23, 27);
									} else {
										// console.log('a ' + SMBooks[x].startdate.toString().substring(0, 11) + SMBooks[x].startdate.toString().substring(24, 28))
										sm = SMBooks[x].startdate.toString().substring(0, 11) + SMBooks[x].startdate.toString().substring(24, 28);
									}
									if (openslots[i].date.toString().length == 27) {
										// console.log('b ' + openslots[i].date.substring(0, 10) + ' ' + openslots[i].date.substring(23, 27))
										os = openslots[i].date.substring(0, 10) + ' ' + openslots[i].date.substring(23, 27);
									} else {
										// console.log('b ' + openslots[i].date.substring(0, 11) + openslots[i].date.substring(24, 29))
										os = openslots[i].date.substring(0, 11) + openslots[i].date.substring(24, 29);
									}

									if (sm == os) {
										if (pd.timeslots[openslots[i].slot] >= SMBooks[x].startdate.toString().substring(11, 16) && pd.timeslots[openslots[i].slot] < SMBooks[x].enddate.toString().substring(11, 16)) {
											var bdate = new Object();
											bdate.slot = openslots[i].slot;
											bdate.date = openslots[i].date.substring(0, 15);
											busyDates.push(bdate);
										}

									}
								}
							}
						}

						var closedList = new Array();

						for (var i = 0; i < busyDates.length; i++) {
							console.log('slot: ' + busyDates[i].slot)
							console.log('date: ' + busyDates[i].date)
						}

						$(".open").each(function () {

							var openSlot = $(this).attr('name');

							for (var i = 0; i < busyDates.length; i++) {
								if (openSlot.substring(5, 6) == busyDates[i].slot &&
									openSlot.substring(11, 26) == busyDates[i].date /*!!!check date here*/) {
//									$(this).children('img').prop('src', "/img/Closed.gif");
//									$(this).prop('class', 'closed');
									console.log('pushing in ' + $(this).attr('name'))

									closedList.push($(this).attr('name'))
								}
							}

						});

//						var src = ['2013/03', '2013/03', '2012/01', '2012/11', '2012/09', '2012/09', '2012/09'];
						for (var i = 0; i < closedList.length; i++) {
							console.log(closedList[i]);
						}

						var cnts = [];
						for (var i = 0; i < closedList.length; i++) {
							var val = closedList[i];
							var count = 1;
							var element = {};
							while (val == closedList[i + 1]) {
								count++;
								i++;
							}
							element.value = val;
							element.count = count;
							cnts.push(element)
						}
						console.log(cnts)

						$(".open").each(function () {

							var openSlot = $(this).attr('name');
//							console.log('>>.. ' + closedList.length)
							for (var i = 0; i < busyDates.length; i++) {
								if (openSlot.substring(5, 6) == busyDates[i].slot &&
									openSlot.substring(11, 26) == busyDates[i].date /*!!!check date here*/) {
//									console.log('a wiht ' + $(this).attr('name'))
//									console.log(closedList.indexOf($(this).attr('name')))
									if (closedList.indexOf($(this).attr('name')) != -1) {
//										console.log('b')
//										console.log(cnts.length)
//										console.log(openSlot)
										for(var x = 0; x < cnts.length; x++){
											var thisvalue = cnts[0].value;

											if(cnts[x].value == openSlot){
												if(cnts[x].count > 1){
													console.log(cnts[x].value)
													console.log(openSlot)
													console.log(cnts[x].count)
													$(this).children('img').prop('src', "/img/Closed.gif");
													$(this).prop('class', 'closed');
												}

											}
										}
//										for (var i = 0; i < cnts.length; i++) {
//											var thisvalue = cnts[i].value;
//											console.log(thisvalue)
////											if (thisvalue == ($(this).attr('name'))) {
//////												console.log('here ' + cnts[i].count)
////											}
//											$(this).children('img').prop('src', "/img/Closed.gif");
//											$(this).prop('class', 'closed');
//											console.log('actually booking out ' + $(this).attr('name'))
//										}
									}
								}
							}

						});

						callback(null, 1);
					}
				},
				function (err, results) {

					$('#zipnextbutton').attr("disabled", false);
					$('#scheduleNext').attr("disabled", true);

				});
		}
	}

});

