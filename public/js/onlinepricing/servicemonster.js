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
									var route = json.items[i].RouteID;
									var tdate = new Object();
									tdate.startdate = Date.parse(tempstartstring);
									tdate.enddate = Date.parse(tempendstring);
									tdate.route = route;

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

//						//TODO dont forget to put in IE explorer shit
//						for (var i = 0; i < openslots.length; i++) {
//							for (var x = 0; x < SMBooks.length; x++) {
//
//								if (pd.browsert != "Explorer") {
//									var thisSlot = pd.timeslots[openslots[i].slot].replace(":", "");
//									thisSlot = thisSlot.replace("am", "")
//									thisSlot = thisSlot.replace("pm", "")
//									var nextSloti = dailySlots.indexOf(thisSlot) + 1;
//									var nextSlot = dailySlots[nextSloti];
//
//									var smBookingStart = SMBooks[x].startdate.toString().substring(16, 24).replace(":", "");
//									var smBookingEnd = SMBooks[x].enddate.toString().substring(16, 24).replace(":", "");
//									smBookingStart = smBookingStart.slice(0, -3);
//									smBookingEnd = smBookingEnd.slice(0, -3);
//
//									var booked = false;
//
////									console.log(smBookingEnd)
////									console.log(smBookingStart)
////									console.log(thisSlot)
////									console.log(nextSlot)
//
//									if (nextSlot) {
//										//inside
//										if (smBookingStart < thisSlot &&
//											smBookingEnd > thisSlot && !booked) {
//											var bdate = new Object();
//											bdate.slot = openslots[i].slot;
//											bdate.date = openslots[i].date.substring(0, 15);
//											busyDates.push(bdate);
//											console.log('1. >slot ' + bdate.slot + 'date '+ bdate.date)
//											booked = true;
//										}
//										// if the booking starts between this slot and next
//										if (smBookingStart > thisSlot &&
//											smBookingStart < nextSlot && !booked) {
//											var bdate = new Object();
//											bdate.slot = openslots[i].slot;
//											bdate.date = openslots[i].date.substring(0, 15);
//											busyDates.push(bdate);
//											console.log(thisSlot)
//											console.log('2. >slot ' + bdate.slot + 'date '+ bdate.date)
//
//											booked = true;
//										}
//									}
////									if (nextSlot) {
////										// starts before beginning and nextSlot before end
////										if (timeslotE < smBookingStart &&
////											nextSlot < smBookingEnd && !booked) {
////											var bdate = new Object();
////											bdate.slot = openslots[i].slot;
////											bdate.date = openslots[i].date.substring(0, 15);
////											busyDates.push(bdate);
////											console.log('1. > ' + bdate.slot)
////											console.log('1. > ' + bdate.date)
////
////											booked = true;
////										}
////										//inside
////										if (smBookingStart < timeslotE &&
////											smBookingEnd > timeslotE && !booked) {
////											var bdate = new Object();
////											bdate.slot = openslots[i].slot;
////											bdate.date = openslots[i].date.substring(0, 15);
////											busyDates.push(bdate);
////											console.log('2. > ' + bdate.slot)
////											console.log('2. > ' + bdate.date)
////											booked = true;
////										}
////										//if the booking starts between this slot and next
////										if (smBookingStart > timeslotE &&
////											smBookingStart < nextSlot && !booked) {
////											var bdate = new Object();
////											bdate.slot = openslots[i].slot;
////											bdate.date = openslots[i].date.substring(0, 15);
////											busyDates.push(bdate);
////											console.log('3. > ' + bdate.slot)
////											console.log('3. > ' + bdate.date)
////											booked = true;
////										}
////										// timeslot is after bookingStart and before bookingEnd
////										if (smBookingStart > timeslotE &&
////											smBookingEnd < timeslotE && !booked) {
////											var bdate = new Object();
////											bdate.slot = openslots[i].slot;
////											bdate.date = openslots[i].date.substring(0, 15);
////											busyDates.push(bdate);
////											console.log('4. > ' + bdate.slot)
////											console.log('4. > ' + bdate.date)
////											booked = true;
////										}
////										//wtf is this one
//////											if (timeslotE <= smBookingStart &&
//////												nextSlot <= smBookingEnd &&
//////												nextSlot >= smBookingStart && !booked
//////												) {
//////												var bdate = new Object();
//////												bdate.slot = openslots[i].slot;
//////												bdate.date = openslots[i].date.substring(0, 15);
//////												busyDates.push(bdate);
//////												console.log('4. > '+bdate)
//////												booked = true;
//////											}
////									}
////									//last slot of day
////									else {
////
////										if (timeslotE <= smBookingStart &&
////											(parseInt(timeslotE) + 200) <= smBookingEnd &&
////											(parseInt(timeslotE) + 200) >= smBookingStart
////											) {
////											var bdate = new Object();
////											bdate.slot = openslots[i].slot;
////											bdate.date = openslots[i].date.substring(0, 15);
////											busyDates.push(bdate);
////											console.log('end 1. > ' + bdate.slot)
////											console.log('1. > ' + bdate.date)
////											booked = true;
////										}
////										//inside3
////										if (smBookingStart < timeslotE &&
////											smBookingEnd > timeslotE && !booked) {
////											var bdate = new Object();
////											bdate.slot = openslots[i].slot;
////											bdate.date = openslots[i].date.substring(0, 15);
////											busyDates.push(bdate);
////											console.log('end 2. > ' + bdate.slot)
////											console.log('end 2. > ' + bdate.date)
////											booked = true;
////										}
////										// timeslot is after bookingStart and before bookingEnd
////										if (smBookingStart > timeslotE &&
////											smBookingEnd < timeslotE && !booked) {
////											var bdate = new Object();
////											bdate.slot = openslots[i].slot;
////											bdate.date = openslots[i].date.substring(0, 15);
////											busyDates.push(bdate);
////											console.log('end 3. > ' + bdate.slot)
////											console.log('end 4. > ' + bdate.date)
////											booked = true;
////										}
////									}
//
//								}
//							}
//						}

						//OLD CODE - ran the loops wrong I think

						for (var x = 0; x < SMBooks.length; x++) {

							for (var i = 0; i < openslots.length; i++) {

								if (pd.browsert != "Explorer") {
									//check dates are the same first
									if (SMBooks[x].startdate.toString().substring(0, 15) ==
										openslots[i].date.substring(0, 15)) {
										//TODO here is where we are working
										var timeslotE = pd.timeslots[openslots[i].slot].replace(":", "");
										timeslotE = timeslotE.replace("am", "")
										timeslotE = timeslotE.replace("pm", "")
										var nextSloti = dailySlots.indexOf(timeslotE) + 1;
										var nextSlot = dailySlots[nextSloti];
										var smBookingStart = SMBooks[x].startdate.toString().substring(16, 24).replace(":", "");
										var smBookingEnd = SMBooks[x].enddate.toString().substring(16, 24).replace(":", "");
										smBookingStart = smBookingStart.slice(0, -3);
										smBookingEnd = smBookingEnd.slice(0, -3);

										/////////////////////////////////////
										//TODO FROM THIS POINT ON----
										//you have to check to be sure its not already added if not it will fuck
										// up your checks when you see if something is added or not more than once
										// on routes
										////////////////////////////////////

										var booked = false;
										var thisRoute = SMBooks[x].route;
										//TODO keep in mind we are looping through timeslots inside book loop
										var thisSMRouteIsAccountedFor = false;
										var skip = false;
										for (var z = 0; z < busyDates.length; z++)
										{
											var busydateRoute = busyDates[z].route;
											var slot = busyDates[z].slot;
											var date = busyDates[z].date;
//											if( openslots[i].slot == busyDates.slot[z] &&
//												openslots[i].date.substring(0, 15) == busyDates.date[z] &&
//												openslots[i].route == busyDates[z].route ){
//												console.log('repeat')
//											}
										}
										if (nextSlot) {
											// inside
//											if (timeslotE >= smBookingStart &&
//												timeslotE < smBookingEnd && !booked) {
//												var bdate = new Object();
//												bdate.slot = openslots[i].slot;
//												bdate.date = openslots[i].date.substring(0, 15);
//												busyDates.push(bdate);
//												console.log('1. > '+bdate)
//												booked = true;
//											}
											// starts before beginning and nextSlot before end
											if (timeslotE < smBookingStart &&
												nextSlot < smBookingEnd && !booked) {
												var bdate = new Object();
												bdate.slot = openslots[i].slot;
												bdate.date = openslots[i].date.substring(0, 15);
												bdate.route = SMBooks[x].route;
												busyDates.push(bdate);
												console.log('1. > ' + bdate.slot)
												console.log('1. > ' + bdate.date)
												booked = true;
											}
											//inside
											if (smBookingStart < timeslotE &&
												smBookingEnd > timeslotE && !booked) {
												var bdate = new Object();
												bdate.slot = openslots[i].slot;
												bdate.date = openslots[i].date.substring(0, 15);
												bdate.route = SMBooks[x].route;
												busyDates.push(bdate);
												console.log('2. > ' + bdate.slot)
												console.log('2. > ' + bdate.date)
												booked = true;
											}
											//if the booking starts between this slot and next
											if (smBookingStart > timeslotE &&
												smBookingStart < nextSlot && !booked) {
												var bdate = new Object();
												bdate.slot = openslots[i].slot;
												bdate.date = openslots[i].date.substring(0, 15);
												bdate.route = SMBooks[x].route;
												busyDates.push(bdate);
												console.log('3. > ' + bdate.slot)
												console.log('3. > ' + bdate.date)
												booked = true;
											}
											// timeslot is after bookingStart and before bookingEnd
											if (smBookingStart > timeslotE &&
												smBookingEnd < timeslotE && !booked) {
												var bdate = new Object();
												bdate.slot = openslots[i].slot;
												bdate.date = openslots[i].date.substring(0, 15);
												bdate.route = SMBooks[x].route;
												busyDates.push(bdate);
												console.log('4. > ' + bdate.slot)
												console.log('4. > ' + bdate.date)
												booked = true;
											}
											//wtf is this one
//											if (timeslotE <= smBookingStart &&
//												nextSlot <= smBookingEnd &&
//												nextSlot >= smBookingStart && !booked
//												) {
//												var bdate = new Object();
//												bdate.slot = openslots[i].slot;
//												bdate.date = openslots[i].date.substring(0, 15);
//												busyDates.push(bdate);
//												console.log('4. > '+bdate)
//												booked = true;
//											}
										}
										//last slot of day
										else {

											if (timeslotE <= smBookingStart &&
												(parseInt(timeslotE) + 200) <= smBookingEnd &&
												(parseInt(timeslotE) + 200) >= smBookingStart && !booked
												) {
												var bdate = new Object();
												bdate.slot = openslots[i].slot;
												bdate.date = openslots[i].date.substring(0, 15);
												bdate.route = SMBooks[x].route;
												busyDates.push(bdate);
												console.log('end 1. > ' + bdate.slot)
												console.log('1. > ' + bdate.date)
												booked = true;
											}
											//inside3
											if (smBookingStart < timeslotE &&
												smBookingEnd > timeslotE && !booked) {
												var bdate = new Object();
												bdate.slot = openslots[i].slot;
												bdate.date = openslots[i].date.substring(0, 15);
												bdate.route = SMBooks[x].route;
												busyDates.push(bdate);
												console.log('end 2. > ' + bdate.slot)
												console.log('end 2. > ' + bdate.date)
												booked = true;
											}
											// timeslot is after bookingStart and before bookingEnd
											if (smBookingStart > timeslotE &&
												smBookingEnd < timeslotE && !booked) {
												var bdate = new Object();
												bdate.slot = openslots[i].slot;
												bdate.date = openslots[i].date.substring(0, 15);
												bdate.route = SMBooks[x].route;
												busyDates.push(bdate);
												console.log('end 3. > ' + bdate.slot)
												console.log('end 4. > ' + bdate.date)
												booked = true;
											}
										}

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
//							console.log('slot: ' + busyDates[i].slot)
//							console.log('date: ' + busyDates[i].date)
						}

						$(".open").each(function () {

							var openSlot = $(this).attr('name');

							for (var i = 0; i < busyDates.length; i++) {
								if (openSlot.substring(5, 6) == busyDates[i].slot &&
									openSlot.substring(11, 26) == busyDates[i].date /*!!!check date here*/) {
//									$(this).children('img').prop('src', "/img/Closed.gif");
//									$(this).prop('class', 'closed');
//									console.log('pushing in ' + $(this).attr('name'))

									closedList.push($(this).attr('name'))
								}
							}

						});

//						var src = ['2013/03', '2013/03', '2012/01', '2012/11', '2012/09', '2012/09', '2012/09'];
						for (var i = 0; i < closedList.length; i++) {
//							console.log(closedList[i]);
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
//						console.log(cnts)

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
										for (var x = 0; x < cnts.length; x++) {
											var thisvalue = cnts[0].value;

											if (cnts[x].value == openSlot) {
												if (cnts[x].count > 1) {
//													console.log(cnts[x].value)
//													console.log(openSlot)
//													console.log(cnts[x].count)
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

