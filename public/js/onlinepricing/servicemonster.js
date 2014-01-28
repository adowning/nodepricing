define(['pricing_data', 'async'], function(prd, async) {

    console.log('initializing servicemonster');

    var pd = prd.getOP(),
        openslots = new Array();

    return {

        addOpenToSMChecklist: function(slotstring) {
            var slotanddate = new Object();
            slotanddate.slot = slotstring.substring(5, 6);
            slotanddate.date = slotstring.substring(11, 50);

            openslots.push(slotanddate);

            return false;

        },

        checkSlotsSM: function() {

            var SMBooks = new Array(),
                busyDates = new Array();

            async.series({
                    one: function(callback) {

                        var startdate = Date.today().toString("MM-dd-yyyy"),
                            enddate = Date.today().addDays(7).toString("MM-dd-yyyy");

                        $.support.cors = true;
                        $.ajax({
                            type: "GET",
                            url: "https://api.servicemonster.net/v1/scheduleItems?startDate=" + startdate + "&endDate=" + enddate + "",
                            contentType: "application/json; charset=utf-8",
                            dataType: "json",
                            beforeSend: function(xhr) {
                                xhr.setRequestHeader("Authorization", "Basic ZTZleGc0Nkw6bUM0RHM5MXFnZXdPUzFv");
                            },
                            complete: function() {
                                callback(null, 1);
                            },
                            success: function(json) {
                                for (var i = 0; i < json.items.length; i++) {
                                    // var option = document.createElement("option                            
                                    var sdate = json.items[i].StartDateTime.substring(0, 10);
                                    var stime = json.items[i].StartDateTime.substring(11, 22);
                                    var tempstartstring = sdate + " " + stime;
                                    var edate = json.items[i].EndDateTime.substring(0, 10);
                                    var etime = json.items[i].EndDateTime.substring(11, 22);
                                    var tempendstring = edate + " " + etime;
                                    var tdate = new Object();
                                    tdate.startdate = Date.parse(tempstartstring);
                                    tdate.enddate = Date.parse(tempendstring);
                                    if (json.items[i].ItemType == 'Job') {
                                        SMBooks.push(tdate);
                                    };
                                };
                                //callback(null, 1);
                            },
                            error: function(msg, url, line) {
                                alert(msg);
                            }
                        });
                    },
                    two: function(callback) {
                        for (var x = 0; x < SMBooks.length; x++) {
                            for (var i = 0; i < openslots.length; i++) {
                                if (pd.browsert != "Explorer") {
                                    if (SMBooks[x].startdate.toString().substring(0, 15) ==
                                        openslots[i].date.substring(0, 15)) {
                                        if (pd.timeslots[openslots[i].slot] >=
                                            SMBooks[x].startdate.toString().substring(16, 24) &&
                                            pd.timeslots[openslots[i].slot] <
                                            SMBooks[x].enddate.toString().substring(16, 24)) {
                                            var bdate = new Object();

                                            bdate.slot = openslots[i].slot;
                                            bdate.date = openslots[i].date.substring(0, 15);
                                            busyDates.push(bdate);
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
                                    // console.log('sm = ' + sm);
                                    // console.log('os = ' + os);


                                    if (sm == os) {
                                        if (pd.timeslots[openslots[i].slot] >= SMBooks[x].startdate.toString().substring(11, 16) && pd.timeslots[openslots[i].slot] < SMBooks[x].enddate.toString().substring(11, 16)) {
                                            var bdate = new Object();
                                            bdate.slot = openslots[i].slot;
                                            bdate.date = openslots[i].date.substring(0, 15);
                                            busyDates.push(bdate);
                                        }

                                        // if (pd.timeslots[openslots[i].slot] >=
                                        //     SMBooks[x].startdate.toString().substring(16, 24) &&
                                        //     pd.timeslots[openslots[i].slot] <
                                        //     SMBooks[x].enddate.toString().substring(16, 24)) {
                                        //     console.log('if 2')
                                        //     var bdate = new Object();

                                        //     bdate.slot = openslots[i].slot;
                                        //     bdate.date = openslots[i].date.substring(0, 15);
                                        //     busyDates.push(bdate);
                                        //     console.log(bdate.toString())
                                        // }
                                    }
                                }
                            }
                        }

                        $(".open").each(function() {

                            var openslot = $(this).attr('name');

                            for (var i = 0; i < busyDates.length; i++) {

                                if (openslot.substring(5, 6) == busyDates[i].slot && openslot.substring(11, 26) == busyDates[i].date /*!!!check date here*/ ) {
                                    $(this).children('img').prop('src', "/img/Closed.gif");
                                    $(this).prop('class', 'closed');

                                }
                            }

                        });

                        callback(null, 1);
                    }
                },
                function(err, results) {

                    $('#zipnextbutton').attr("disabled", false);
                    $('#scheduleNext').attr("disabled", true);

                });
        }
    }
});