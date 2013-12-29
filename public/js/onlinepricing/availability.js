// var selecteddate = "";
// var monday = Date.monday();
// var tuesday = Date.tuesday();
// var wend = Date.wednesday();
// var thurs = Date.thursday();
// var fri = Date.friday();
// var sat = Date.saturday();
// var sunday = Date.sunday();
// var currentdatetime;
// var laststatus;
// var timeslots = ["9:00 am", "11:00 am", "1:00 pm", "3:00 pm"];
// var base = 0;
// var bookedslots = "";
// var price = "";
// var stylesettings;

// $(document).ready(function() {
//     console.log('loading availability script ls = '+laststatus);

//     $('.nextweek').on("click", function() {
//         addWeek(7);
//     });
//     $('.lastweek').on("click", function() {
//         addWeek(-7);
//     });

// jQuery.removeFromArray = function(value, arr) {
//     return jQuery.grep(arr, function(elem, index) {
//         return elem !== value;
//     });
// };

//     $.ajax({
//         url: "/updateavailability",
//         type: "POST",
//         dataType: "json",
//         cache: false,
//         timeout: 5000,
//         complete: function(some) {
//             buildStable();
//         },
//         success: function(some) {
//             $.each(some, function(index, element) {
//                 price = element;

//             });
          
//         },
//         error: function() {},
//     });

// });


// function buildStable() {
//     $("#stable > tbody > tr").remove();
//     $('#prestable-date').html("<h4>" + monday.toString('MMMM dS') + ' - ' + sat.toString('MMMM dS') + "</h4>");
//     $('.mondayhead').html("Mon<br>" + monday.toString('dS'));
//     $('.tuesdayhead').html('Tue<br>' + tuesday.toString('dS'));
//     $('.wendhead').html('Wen<br>' + wend.toString('dS'));
//     $('.thurshead').html('Thu<br>' + thurs.toString('dS'));
//     $('.frihead').html('Fri<br>' + fri.toString('dS'));
//     $('.sathead').html('Sat<br>' + sat.toString('dS'));
//     var i = 0;
//     $.each(timeslots, function(index, element) {
//         //$.each(price.timeslots, function(index, element) {
//         ts = element;
//         $("#stable > tbody").append("<tr><td>" + element + "</td><td class='open' name='slot " + i + " day " + monday + "'><img src='/img/Open.jpg' alt='This timeslot is available'></td><td class='open' name='slot " + i + " day " + tuesday + "'><img  src='/img/Open.jpg' alt='This timeslot is available'></td><td class='open' name='slot " + i + " day " + wend + "'><img src='/img/Open.jpg' alt='This timeslot is available'></td><td class='open' name='slot " + i + " day " + thurs + "'><img src='/img/Open.jpg' alt='This timeslot is available'></td><td class='open' name='slot " + i + " day " + fri + "'><img src='/img/Open.jpg' alt='This timeslot is available'></td><td class='open' name='slot " + i + " day " + sat + "'><img src='/img/Open.jpg' alt='This timeslot is available'></td> </tr>");
//         i++;
//     });
//     fillSchedule();
// }

// function addWeek(delta) {
//     if (base == 0 && delta < 0) {
//         return false;
//     };
//     base += delta;
//     monday = Date.monday().addDays(base);
//     tuesday = Date.tuesday().addDays(base);
//     wend = Date.wednesday().addDays(base);
//     thurs = Date.thursday().addDays(base);
//     fri = Date.friday().addDays(base);
//     sat = Date.saturday().addDays(base);
//     sunday = Date.sunday().addDays(base);
//     buildStable();
// }

// function fillSchedule() {

//     $(".open").each(function() {
//         adate = $(this).attr('name');
//         if (!adate || adate == null || adate == 'undefined') {} else {
//             if (parseDate(adate) != 'closed') {
//                 if (parseDate(adate).isBefore(Date.today().addDays(1))) {
//                     $(this).children('img').attr('src', "/img/Closed.gif");
//                     $(this).prop('class', 'closed');
//                     $(this).prop('old', 'yes');

//                 } else {
//                     var openobject = $(this);
//                     $.each(price.bookedslots, function(index, element) {
//                         if (adate == element) {
//                             openobject.children('img').attr('src', "/img/Closed.gif");
//                             openobject.prop('class', 'closed');
//                             //$(this).children('img').attr('src', "/img/Closed.gif");
//                             //$(this).prop('class', 'closed');
//                         }
//                     });
//                 }
//             } else {}
//         }

//     })
//     $('.open').click(function(event) {

//         //console.log($($('[name="' + selecteddate + '"]')).attr('class'));
//         $(this).children('img').attr('src', "/img/Selected.jpg");
//         $(this).prop('class', 'selected');
//         if (laststatus == 'closed') {
//             $($('[name="' + selecteddate + '"]')).children('img').attr('src', "/img/Closed.gif");
//             $($('[name="' + selecteddate + '"]')).attr('class', "closed");
//         } else {

//             $($('[name="' + selecteddate + '"]')).children('img').attr('src', "/img/Open.jpg");
//             $($('[name="' + selecteddate + '"]')).attr('class', "open");

//         }
//         laststatus = 'open';
//         //console.log('open clickec last status = '+laststatus);
//         selecteddate = $(this).attr('name');
//         console.log('op - SELECTED DATE CHANGED TO '+selecteddate+' and it was '+laststatus);
//         setJobDateTime(selecteddate);
//     });
//     $('.closed').click(function(event) {

//         // console.log($($('[name="' + selecteddate + '"]')).attr('class'));
//         $(this).children('img').attr('src', "/img/Selected.jpg");
//         $(this).prop('class', 'selected');
//         if (laststatus == 'closed') {
//             $($('[name="' + selecteddate + '"]')).children('img').attr('src', "/img/Closed.gif");
//             $($('[name="' + selecteddate + '"]')).attr('class', "closed");
//         } else {

//             $($('[name="' + selecteddate + '"]')).children('img').attr('src', "/img/Open.jpg");
//             $($('[name="' + selecteddate + '"]')).attr('class', "open");

//         }
//         laststatus = 'closed';
//         //console.log('closed clickec last status = '+laststatus);

//         selecteddate = $(this).attr('name');
//         console.log('cl - SELECTED DATE CHANGED TO '+selecteddate+' and it was '+laststatus);
        

//        // setJobDateTime(selecteddate);
//     });


// }

// function parseDate(daystring) {
//     var day = daystring.split(' day ');
//     var day2 = day[1].split('GMT');
//     var day3 = day2[0].replace(' 00:00:00', '');
//     if ($.client.browser != 'Explorer') {
//         var adate = Date.parse(day3);
//         if (!adate) {
//             return "closed";
//         }
//     } else {
//         var adate = Date.parse(day2[0]);
//         if (!adate) {
//             return "closed";
//         }
//     }
//     return adate;
// }

// function setJobDateTime(dt) {
//     currentdatetime = dt;
// }

// function changeStatus() {
//     //there be dragons here
//     //TODO pleaze fix me
//     if ($($('[name="' + selecteddate + '"]')).prop('old') != 'yes') {
//         updateServer(selecteddate);
//         if (laststatus == 'closed') {
//             console.log('making open '+ selecteddate);

//             $($('[name="' + selecteddate + '"]')).children('img').attr('src', "/img/Open.jpg");
//             $($('[name="' + selecteddate + '"]')).attr('class', "open");
//             laststatus = 'open';
//             console.log($($('[name="' + selecteddate + '"]')).attr('class'));
//         } else {
//             console.log('making closed ' + selecteddate);
//             $($('[name="' + selecteddate + '"]')).children('img').attr('src', "/img/Closed.gif");
//             $($('[name="' + selecteddate + '"]')).attr('class', "closed");
//             laststatus = 'closed';
//             console.log($($('[name="' + selecteddate + '"]')).attr('class'));
//         }
//     } else {
//         alert('Unable to go back in time and open slots.');
//     }

// }

// function updategraphics (){
//     console.log('updateing grphics');
// }
// function updateServer(sd) {
//     if (jQuery.inArray(sd, price.bookedslots) != -1) {
//         price.bookedslots = jQuery.removeFromArray(sd, price.bookedslots);
//     } else {
//         //console.log('selecteddate not found adding to array');
//         price.bookedslots.push(sd);
//     }
//     //console.log('bs >>> ' + price.bookedslots.length);
//     $.ajax({
//         url: "/changeavailability",
//         type: "POST",
//         dataType: "json",
//         data: JSON.stringify(price.bookedslots),
//         contentType: "application/json",
//         cache: false,
//         timeout: 5000,
//         complete: function(some) {
//             //console.log('server updated sucessfully new array ' + price.bookedslots);
//         },
//         success: function(some) {},
//         error: function() {},
//     });
//     //callback();
// }