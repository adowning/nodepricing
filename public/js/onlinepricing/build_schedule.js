define(['pricing_data', 'servicemonster'], function(prd, sm) {

    console.log('buildschedule loading');

    var base = 0;

    var pd = prd.getOP();

    var parseDate = function(daystring) {

        var day = daystring.split(' day '),
            day2 = day[1].split('GMT'),
            day3 = day2[0].replace(' 00:00:00', '');
        if (pd.browsert != 'Explorer') {

            var adate = Date.parse(day3);

            if (!adate) {

                return "closed";

            }

        } else {

            var adate = Date.parse(day2[0]);

            if (!adate) {

                return "closed";

            }
        }

        return adate;
    }

    var convertFromMilitary = function(timestring) {
        console.log('ts = ' + timestring);

        if (pd.browsert == 'Explorer') {
            console.log('explorer in convert')
            var hours24 = parseInt(timestring.substring(0, 2), 10);
            var hours = ((hours24 + 11) % 12) + 1;
            var amPm = hours24 > 11 ? 'pm' : 'am';
            var minutes = timestring.substring(2);
            console.log('converted time hours' + hours);
            console.log('converted time minutes ' + minutes)
            return hours + minutes;

        } else {
            console.log('chrom in convert')
            var hours24 = parseInt(timestring.substring(0, 2), 10);
            var hours = ((hours24 + 11) % 12) + 1;
            var amPm = hours24 > 11 ? 'pm' : 'am';
            var minutes = timestring.substring(2, 5);
            console.log('converted time hours' + hours);
            console.log('converted time minutes ' + minutes)
            console.log('converted time ' + hours + minutes + ' ' + amPm)
            return hours + minutes + ' ' + amPm;
        }
    }

    var setJobDateTime = function(dt) {

        $('#dt').val(dt);

        var day = dt.split(' day '),
            time = day[0].replace(/[^\d.]/g, ""),
            t = pd.timeslots[time],
            sday2 = day[1].split('GMT');
        convertedtime = convertFromMilitary(t);
        if (pd.browsert != "Explorer") {

            var sadate = Date.parse(sday2[0].replace(' 00:00:00', ''));
            console.log('sadate = ' + sadate.toString().substring(0, 15))
            $('#scheduletime').val(convertedtime);
            $('#scheduletimespan').html(convertedtime);
            $('#scheduledate').val(sadate);
            $('#scheduledatespan').html(sadate.toString().substring(0, 15));

        } else {

            var sday3 = day[1].split(' 00:00:00');
            $('#scheduledate').val(sday3[0]);
            $('#scheduledatespan').html(sday3[0]);
            $('#scheduletime').val(convertedtime);
            $('#scheduletimespan').html(convertedtime);

        }

        var n = $(".selected").length;

        if (n > 0) {

            $('#scheduleNext').prop("disabled", false);

        } else {

            $('#scheduleNext').prop("disabled", true);

        }
    };

    var fillSchedule = function() {

        if (pd.browsert == 'Explorer' && pd.browserv < 8) {
            $(".open").each(function() {

                adate = $(this).prop('name');

                if (!adate || adate == null || adate == 'undefined') {} else {

                    $(this).children('img').prop('src', "/img/Closed.gif");
                    $(this).prop('class', 'closed');

                }

            });

            $('.open').click(function(event) {

                $(this).children('img').prop('src', "/img/Selected.jpg");
                $(this).prop('class', 'selected');
                $($('[name="' + selecteddate + '"]')).children('img').prop('src', "/img/Open.jpg");
                $($('[name="' + selecteddate + '"]')).prop('class', "open");
                selecteddate = $(this).prop('name');
                setJobDateTime(selecteddate);

            });

            sm.checkSlotsSM();

            return;
        }

        $(".open").each(function() {

            adate = $(this).attr('name');
            if (!adate || adate == null || adate == 'undefined') {
                console.log('adate is null')

            } else {

                if (parseDate(adate) != 'closed') {

                    if (parseDate(adate).isBefore(Date.today().addDays(1))) {

                        $(this).children('img').attr('src', "/img/Closed.gif");
                        $(this).prop('class', 'closed');

                    } else {

                        for (var i in pd.bookedslots) {

                            if (pd.bookedslots[i] == adate) {

                                $(this).children('img').attr('src', "/img/Closed.gif");
                                $(this).prop('class', 'closed');

                            }
                        }
                    }

                    if ($(this).prop('class') == 'open' && pd.servicemonster == "true") {

                        sm.addOpenToSMChecklist(adate);

                    } else {}

                } else {}
            }
        });

        $('.open').click(function(event) {

            $(this).children('img').attr('src', "/img/Selected.jpg");
            $(this).prop('class', 'selected');
            $($('[name="' + pd.selecteddate + '"]')).children('img').attr('src', "/img/Open.jpg");
            $($('[name="' + pd.selecteddate + '"]')).attr('class', "open");

            pd.selecteddate = $(this).attr('name');

            setJobDateTime(pd.selecteddate);

        });

        sm.checkSlotsSM();

    };

    var buildSchedulingTable = function() {

        $("#stable > tbody > tr").remove();
        $('#prestable-date').html("<h4>" + pd.monday.toString('MMMM dS') + ' - ' + pd.sat.toString('MMMM dS') + "</h4>");
        $('.mondayhead').html("Mon<br>" + pd.monday.toString('dS'));
        $('.tuesdayhead').html('Tue<br>' + pd.tuesday.toString('dS'));
        $('.wendhead').html('Wen<br>' + pd.wend.toString('dS'));
        $('.thurshead').html('Thu<br>' + pd.thurs.toString('dS'));
        $('.frihead').html('Fri<br>' + pd.fri.toString('dS'));
        $('.sathead').html('Sat<br>' + pd.sat.toString('dS'));

        $.each(pd.timeslots, function(index, element) {
            var converted = convertFromMilitary(element);

            $("#stable > tbody").append("<tr><td>" + converted + "</td><td class='open' name='slot " + index + " day " + pd.monday + "'><img src='/img/Open.jpg' alt='This timeslot is available'></td><td class='open' name='slot " + index + " day " + pd.tuesday + "'><img  src='/img/Open.jpg' alt='This timeslot is available'></td><td class='open' name='slot " + index + " day " + pd.wend + "'><img src='/img/Open.jpg' alt='This timeslot is available'></td><td class='open' name='slot " + index + " day " + pd.thurs + "'><img src='/img/Open.jpg' alt='This timeslot is available'></td><td class='open' name='slot " + index + " day " + pd.fri + "'><img src='/img/Open.jpg' alt='This timeslot is available'></td><td class='open' name='slot " + index + " day " + pd.sat + "'><img src='/img/Open.jpg' alt='This timeslot is available'></td> </tr>");

        });

        fillSchedule();

    }

    return {

        buildStable: function() {

            buildSchedulingTable();

        },

        addWeek: function(delta) {

            if (base == 0 && delta < 0) {

                return false;

            };

            base += delta;

            pd.monday = Date.monday().addDays(base);
            pd.tuesday = Date.tuesday().addDays(base);
            pd.wend = Date.wednesday().addDays(base);
            pd.thurs = Date.thursday().addDays(base);
            pd.fri = Date.friday().addDays(base);
            pd.sat = Date.saturday().addDays(base);
            pd.sunday = Date.sunday().addDays(base);

            buildSchedulingTable();

        }

    }
});