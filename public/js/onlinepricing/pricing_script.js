//Pricing calc 
//by ash downing 
//andrewscarpetcleaning.com
var openslots = new Array();


$(document).ready(function() {
    // $(".order-confirmation").click(function(e) {
    //     bootbox.alert("Hello world!", function() {
    //         console.log("Alert Callback");
    //     });
    // });
    // console.log(servicemonster);
    // console.log('doc rdy');
    setExitPage('zipcode');

    window.onbeforeunload = function() {
        saveExitPage();
    };

    $('#timeholder').prop('disabled', 'disabled');
    $(".settime").click(function(e) {
        $('#scheduletime').val($(this).data('time'));
        $('#timeholder').prop('placeholder', ($(this).data('time')));
        e.preventDefault();
    });

    var zip = "none";
    buildItems();
    addAction();
    buildStable();
    Number.prototype.formatMoney = function(c, d, t) {
        var n = this,
            c = isNaN(c = Math.abs(c)) ? 2 : c,
            d = d == undefined ? "." : d,
            t = t == undefined ? "," : t,
            s = n < 0 ? "-" : "",
            i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
            j = (j = i.length) > 3 ? j % 3 : 0;
        return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
    };

    function getParameters() {
        var searchString = window.location;
        var st = searchString.toString();
        var parm = st.split('key=');
        var p = parm[1];
        if (p = "" || !p) {
            //TODO redirect to 404
        }
        return p;
    }

    $('.nextweek').on("click", function() {
        addWeek(7);
    });

    $('.lastweek').on("click", function() {

        addWeek(-7);
    });
    //TODO fix me!
    $('#collapseOne').on('shown.bs.collapse', function() {
        activegroup = $(this).parent().find('.accordion-toggle').text().replace(/[^A-Za-z]+/g, '');
    });
    $('#collapseTwo').on('shown.bs.collapse', function() {
        activegroup = $(this).parent().find('.accordion-toggle').text().replace(/[^A-Za-z]+/g, '');
    });
    $('#collapseThree').on('shown.bs.collapse', function() {
        activegroup = $(this).parent().find('.accordion-toggle').text().replace(/[^A-Za-z]+/g, '');
    });
    $('#collapseFour').on('shown.bs.collapse', function() {
        activegroup = $(this).parent().find('.accordion-toggle').text().replace(/[^A-Za-z]+/g, '');
    });
    $('.panel-body').on('show', function() {
        activegroup = $(this).parent().find('.accordion-toggle').text().replace(/[^A-Za-z]+/g, '');
    });

    $('.collapse').on('hide', function() {
        $(this).parent().find('a').removeClass('open'); //remove active state to button on close
    });

    //$(rotateAds);
    checkBrowserChangeBookModal();



});

$('#couponBut').click(function(e) {
    e.preventDefault();
    setCouponCode($('#coupon').val());

});
$('#coupon').bind("enterKey", function(e) {
    e.preventDefault();
    setCouponCode($('#coupon').val());

});

$('#coupon').keyup(function(e) {
    e.preventDefault();
    if (e.keyCode == 13) {
        $(this).trigger("enterKey");

    }

});


function checkValidity(item) {
    //seems verbose but allows for high variabilty in activegroup
    //may change later to reduce code
    switch (activegroup) {
        case "Carpet":
            var roomcleaningcost = carpetprices[item];
            var protectprice = carpetprotectionprices[item];
            var deodorizeprice = carpetdeodorizeprices[item];
            if (roomcleaningcost == undefined || protectprice == undefined || deodorizeprice == undefined) {
                return false;
            } else {
                return true;
            }

            break;
        case "Tile":
            var roomcleaningcost = hashTilePrices[item];
            var protectprice = hashTilePricesProt[item];
            if (roomcleaningcost == undefined || protectprice == undefined) {
                return false;
            } else {
                return true;
            }
            break;
        case "OrientalRugs":
            var roomcleaningcost = hashRugPrices[item];
            var protectprice = hashRugProt[item];
            var deodorizeprice = hashRugDeod[item];

            if (roomcleaningcost == undefined || protectprice == undefined || deodorizeprice == undefined) {
                return false;
            } else {
                return true;
            }
            break;
        case "Upholstery":
            var roomcleaningcost = hashUp[item];
            var protectprice = hashUpProt[item];
            var deodorizeprice = hashUpDeod[item];

            if (roomcleaningcost == undefined || protectprice == undefined || deodorizeprice == undefined) {
                return false;
            } else {
                return true;
            }
            break;

            return true;
    }
};

function addAction() {
    $(".action-addroom").click(function(e) {

        //prelim check to make sure we have prices for everything, if not
        //were gonna throw an error alert
        if (!checkValidity($(this).html())) {
            alert('Error! ' + $(this).html());
            return false;
        }
        switch ($(this).data('type')) {

            case "carpet_furn":
                var roomtype = $(this).html();
                var roomtype_nospace = roomtype.replace(' ', '_');
                roomtype_nospace = roomtype.replace(/\W/g, '');
                sp = 'Protect';
                if (activegroup == "Tile") {
                    sp = 'Seal';
                }
                if (_.indexOf(activecarpetrooms, $(this).html()) == -1) {
                    $('#carpetrooms').find('tbody').append('<tr class="' + activegroup + '" value=' + $(this).data('price') + '><td id="roomcell" name="roomcell">' + activegroup + " - " + $(this).html() + '</td><td id="selectcell" name="selectcell" ><select class="input-mini" id="carpetclean' + roomtype_nospace + '" class="input-mini"><option>0</option></select></td><td id="optioncell" name="optioncell">Clean</td><td id="selectcell" name="selectcell" ><select  id="carpetprotect' + roomtype_nospace + '"  class="input-mini"><option>0</option></select></td><td id="optioncell" name="optioncell">' + sp + '</td><td id="selectcell" name="selectcell" ><select id="carpetdeodorize' + roomtype_nospace + '"  class="input-mini"><option>0</option></select></td><td id="optioncell-last" name="optioncell-last">Deodorize</td></tr>');
                    if (_.indexOf(roomtype_nospace, "Tile") !== -1) {
                        $('td[class*=carpetdeodorize]').hide();
                    }
                    //fill cleaning select box
                    for (var i = 0; i < 10; i++) {
                        $('#carpetclean' + roomtype_nospace + '').append($('<option>', {
                            value: i + 1,
                            text: i + 1
                        }));
                    }
                    $("#carpetclean" + roomtype_nospace + " option:eq(1)").prop("selected", true);


                    activecarpetrooms.push(roomtype);
                    var size = getCount(roomtype, activecarpetrooms);
                } else {
                    activecarpetrooms.push($(this).html());
                    var size = getCount(roomtype, activecarpetrooms);
                    var oldprot = parseInt($("#carpetprotect" + roomtype_nospace + " option:selected").val());
                    var olddeod = parseInt($("#carpetdeodorize" + roomtype_nospace + " option:selected").val());
                    var newtotal = parseInt($("#carpetclean" + roomtype_nospace + " option:selected").val()) + parseInt(1);
                    $('#carpetclean' + roomtype_nospace + " option:eq(" + size + ")").prop("selected", true);

                }
                //set correct amount to select from for prot and deod
                //based on how many we have of the roomtype
                $('#carpetprotect' + roomtype_nospace + '').children('option:not(:first)').remove();
                //if (activegroup == 'Carpet' || activegroup == 'Upholstery') {
                $('#carpetdeodorize' + roomtype_nospace + '').children('option:not(:first)').remove();
                // }
                if (size > 10) {
                    size = 10;
                }
                for (var i = 0; i < size; i++) {
                    $('#carpetprotect' + roomtype_nospace + '').append($('<option>', {
                        value: i + 1,
                        text: i + 1
                    }));
                    // if (activegroup == 'Carpet' || activegroup == 'Upholstery') {
                    $('#carpetdeodorize' + roomtype_nospace + '').append($('<option>', {
                        value: i + 1,
                        text: i + 1
                    }));
                }
                //}
                if (oldprot <= newtotal) {
                    $("#carpetprotect" + roomtype_nospace + " option:eq(" + oldprot + ")").prop("selected", true);
                }
                // if (activegroup == 'Carpet' || activegroup == 'Upholstery') {
                if (olddeod <= newtotal) {
                    $("#carpetdeodorize" + roomtype_nospace + " option:eq(" + olddeod + ")").prop("selected", true);
                }
                //}
                $("#carpetclean" + roomtype_nospace + "").change(function() {
                    amountChangeOptions(roomtype_nospace, roomtype);
                });
                $("#carpetprotect" + roomtype_nospace + "").change(function() {
                    updateTotal();
                });
                //if (activegroup == 'Carpet' || activegroup == 'Upholstery') {
                $("#carpetdeodorize" + roomtype_nospace + "").change(function() {
                    updateTotal();
                });
                //}
                if (activegroup == "Tile") {
                    var row_index = $(this).parent().index('tr');
                    $('#carpetrooms tr:eq(-1) td:last-child').hide();
                    $("#carpetdeodorize" + roomtype_nospace).hide();
                }
                $('#carpetrooms').show();

                addScrollBar();

                updateTotal();
                break;

            default:
        }
        e.preventDefault();
    });
}

function addScrollBar() {
    if ((('#carpetrooms tr').length) > 4) {
        //$('#quotespan').
    }
};

function amountChangeOptions(roomtype_nospace, roomtype) {
    //remove row if we changed clean amount to 0
    if ($('#carpetclean' + roomtype_nospace + ' :selected').val() == 0) {
        $('#carpetclean' + roomtype_nospace + '').parent().parent().remove();
        var index = _.indexOf(activecarpetrooms, roomtype);
        activecarpetrooms.splice(index, 1);

        var rowCount = $('#carpetrooms tr').length;
        if (rowCount < 2) {
            $('#carpetrooms').hide();
        } else {
            $('#carpetrooms').show();
        }
        updateTotal();
        return;
    }

    var oldprot = parseInt($("#carpetprotect" + roomtype_nospace + " option:selected").val());
    var olddeod = parseInt($("#carpetdeodorize" + roomtype_nospace + " option:selected").val());
    $('#carpetprotect' + roomtype_nospace + '').children('option:not(:first)').remove();
    $('#carpetdeodorize' + roomtype_nospace + '').children('option:not(:first)').remove();

    clearOut(roomtype, activecarpetrooms);
    for (var i = 0; i < $('#carpetclean' + roomtype_nospace + ' :selected').val(); i++) {
        $('#carpetprotect' + roomtype_nospace + '').append($('<option>', {
            value: i + 1,
            text: i + 1
        }));
        $('#carpetdeodorize' + roomtype_nospace + '').append($('<option>', {
            value: i + 1,
            text: i + 1
        }));
        activecarpetrooms.push(roomtype);
    }
    //TODO FIx me
    // var roomtype_nospace = roomtype.replaceAll(' ', '_');
    //         roomtype_nospace = roomtype.replace(/\W/g, '');
    if (oldprot > parseInt($("#carpetclean" + roomtype_nospace + " option:selected").val())) {

        $("#carpetprotect" + roomtype_nospace + " option:eq(" + $('#carpetclean' + roomtype_nospace + ' :selected').val() + ")").prop("selected", true);
    } else {

        $("#carpetprotect" + roomtype_nospace + " option:eq(" + oldprot + ")").prop("selected", true);
    }
    if (olddeod > parseInt($("#carpetclean" + roomtype_nospace + " option:selected").val())) {
        $("#carpetdeodorize" + roomtype_nospace + " option:eq(" + $('#carpetclean' + roomtype_nospace + ' :selected').val() + ")").prop("selected", true);
    } else {
        $("#carpetdeodorize" + roomtype_nospace + " option:eq(" + olddeod + ")").prop("selected", true);
    }
    updateTotal();
}

function clearOut(aVal, myArr) {
    while ((_.indexOf(aVal, myArr)) !== -1) {
        myArr.splice(_.indexOf(myArr, aVal), 1);
    }

    return true;
}



function updateTotal() {
    var runningcleaningtotal = 0;
    var r = 0;

    $("#carpetrooms tr").each(function() {
        $this = $(this);
        //nasty, make a switch or something
        if (r > 1) {
            var currentgroup = ($this).prop('class');
            var thistype = $(this).find('td:eq(0)').html();
            var tt = thistype.split(" - ");
            thistype = tt[1];
            thistype = thistype.replace('_', ' ');
            if (currentgroup == "Carpet") {
                var roomcleaningcost = carpetprices[thistype];
                var protectprice = carpetprotectionprices[thistype];
                var deodorizeprice = carpetdeodorizeprices[thistype];
            }
            if (currentgroup == "Upholstery") {
                var roomcleaningcost = hashUp[thistype];
                var protectprice = hashUpProt[thistype];
                var deodorizeprice = hashUpDeod[thistype];
            }
            if (currentgroup == "OrientalRugs") {
                var roomcleaningcost = hashRugPrices[thistype];
                var protectprice = hashRugProt[thistype];
                var deodorizeprice = hashRugDeod[thistype];
            }
            if (currentgroup == "Tile") {
                var roomcleaningcost = hashTilePrices[thistype];
                var protectprice = hashTilePricesProt[thistype];
            }
            //trip charge added here
            roomcleaningcost = roomcleaningcost * tripchargevalue;
            protectprice = protectprice * tripchargevalue;
            deodorizeprice = deodorizeprice * tripchargevalue;

            var selectValue = $(this).find("td:eq(1)").find("select option:selected").val();
            var protection = $(this).find("td:eq(3)").find("select option:selected").val() * protectprice;
            // if (currentgroup == "Carpet" || currentgroup == "Upholstery") {
            var deodorize = $(this).find("td:eq(5)").find("select option:selected").val() * deodorizeprice;
            if (!deodorize || deodorize == 'undefined') {
                deodorize = 0;
            }
            //tripcharge additions
            runningcleaningtotal = (runningcleaningtotal + (selectValue * roomcleaningcost)) + protection + deodorize;
        }
        r++;
    });

    if (runningcleaningtotal !== 0 && runningcleaningtotal) {

        // if (tripcharge != 0) {
        //     runningcleaningtotal = parseInt(runningcleaningtotal) + parseInt(tripcharge);

        // }
        if (runningcleaningtotal < 99.50) {
            runningcleaningtotal = 99.50;
            $('.mincharge-span').css('background', '#8ec252');
            $('.mincharge-span').html("<div class='alert'>* Minimum charge.</div>");

        } else {
            $('.mincharge-span').text("");
        }
        runningcleaningtotal -= discountvalue;
        //alert(runningcleaningtotal);
        //runningcleaningtotal = runningcleaningtotal * tripchargevalue;
        //alert(runningcleaningtotal.toFixed(2));
        var tax = runningcleaningtotal * .0825;
        var ftax = parseFloat(tax.toFixed(2));
        tot = parseFloat((ftax + runningcleaningtotal).toFixed(2));
        $('.totalspan').text((runningcleaningtotal).formatMoney(2, '.', ','));
        $('.taxspan').text((ftax).formatMoney(2, '.', ','));
        $('.totspan').text('$' + (tot).formatMoney(2, '.', ','));
        $('#priceNext').prop("disabled", false);
        $('#noservice').hide();
    } else {
        $('#noservice').show();
        $('.totalspan').text('0');
        $('.taxspan').text('0');
        $('.totspan').text('$' + '0');
        $('#priceNext').prop("disabled", true);
    }

}

$('.remove').on("click", function() {
    $(this).closest("tr.deleteRow").remove();
    return false;
});

$('#myTab a').click(function(e) {
    e.preventDefault();
    $(this).tab('show');
});

function setCouponCode(key) {
    var value = couponCodes[key];
    if (value == undefined) {} else {
        discountvalue = value;
        $('#discountamount').text(value);
        $('#discountrow').show();
        updateTotal();
    }

}

function getCount(aVal, myArr) {
    num = 0;
    for (i = 0; i < myArr.length; i++) {
        if (myArr[i] == aVal) num++;
    }
    return num;
}



function buildStable() {
    $("#stable > tbody > tr").remove();
    $('#prestable-date').html("<h4>" + monday.toString('MMMM dS') + ' - ' + sat.toString('MMMM dS') + "</h4>");
    $('.mondayhead').html("Mon<br>" + monday.toString('dS'));
    $('.tuesdayhead').html('Tue<br>' + tuesday.toString('dS'));
    $('.wendhead').html('Wen<br>' + wend.toString('dS'));
    $('.thurshead').html('Thu<br>' + thurs.toString('dS'));
    $('.frihead').html('Fri<br>' + fri.toString('dS'));
    $('.sathead').html('Sat<br>' + sat.toString('dS'));
    var i = 0;
    $.each(price.timeslots, function(index, element) {
        ts = element;
        $("#stable > tbody").append("<tr><td>" + element + "</td><td class='open' name='slot " + i + " day " + monday + "'><img src='/img/Open.jpg' alt='This timeslot is available'></td><td class='open' name='slot " + i + " day " + tuesday + "'><img  src='/img/Open.jpg' alt='This timeslot is available'></td><td class='open' name='slot " + i + " day " + wend + "'><img src='/img/Open.jpg' alt='This timeslot is available'></td><td class='open' name='slot " + i + " day " + thurs + "'><img src='/img/Open.jpg' alt='This timeslot is available'></td><td class='open' name='slot " + i + " day " + fri + "'><img src='/img/Open.jpg' alt='This timeslot is available'></td><td class='open' name='slot " + i + " day " + sat + "'><img src='/img/Open.jpg' alt='This timeslot is available'></td> </tr>");
        i++;
    });
    fillSchedule();
}

function addWeek(delta) {
    if (base == 0 && delta < 0) {
        return false;
    };
    base += delta;
    monday = Date.monday().addDays(base);
    tuesday = Date.tuesday().addDays(base);
    wend = Date.wednesday().addDays(base);
    thurs = Date.thursday().addDays(base);
    fri = Date.friday().addDays(base);
    sat = Date.saturday().addDays(base);
    sunday = Date.sunday().addDays(base);
    buildStable();
}

function checkSlotsSM() {
    var SMBooks = new Array();
    var busyDates = new Array();
    async.series({
            one: function(callback) {
                //TODO enter dates being checked here!!!!
                console.log('today '+Date.today().toString("dd-MM-yyyy"))
                console.log('week from now '+Date.today().addDays(7).toString("dd-MM-yyyy"))

                var startdate = Date.today().toString("dd-MM-yyyy")
                var enddate = Date.today().addDays(7).toString("dd-MM-yyyy")
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
                            SMBooks.push(tdate);

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
                        // console.log(timeslots[openslots[i].slot]+SMBooks[x].startdate.toString().substring(16, 24))
                        if (SMBooks[x].startdate.toString().substring(0, 15) ==
                            openslots[i].date.substring(0, 15)) {

                            if (timeslots[openslots[i].slot] >=
                                SMBooks[x].startdate.toString().substring(16, 24) &&
                                timeslots[openslots[i].slot] <
                                SMBooks[x].enddate.toString().substring(16, 24)) {
                                var bdate = new Object();

                                bdate.slot = openslots[i].slot;
                                bdate.date = openslots[i].date.substring(0, 15);
                                busyDates.push(bdate);
                            }
                        }
                    }
                }

                $(".open").each(function() {
                    openslot = $(this).attr('name');
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

function addOpenToSMChecklist(slotstring) {

    var slotanddate = new Object();
    slotanddate.slot = slotstring.substring(5, 6);
    slotanddate.date = slotstring.substring(11, 50);
    openslots.push(slotanddate);
    //console.log('added to os with time '+slotanddate.slot)
    return false;
}


function fillSchedule() {
    if (browser == 'old') {
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
        checkSlotsSM();
        return;
    }

    $(".open").each(function() {
        adate = $(this).attr('name');
        if (!adate || adate == null || adate == 'undefined') {} else {
            if (parseDate(adate) != 'closed') {
                if (parseDate(adate).isBefore(Date.today().addDays(1))) {

                    $(this).children('img').attr('src', "/img/Closed.gif");
                    $(this).prop('class', 'closed');
                } else {
                    for (var i in price.bookedslots) {
                        if (price.bookedslots[i] == adate) {
                            $(this).children('img').attr('src', "/img/Closed.gif");
                            $(this).prop('class', 'closed');
                        }
                    }
                }

                if ($(this).prop('class') == 'open' && servicemonster == "true") {
                    addOpenToSMChecklist(adate);
                } else {}

            } else {}
        }
    });

    $('.open').click(function(event) {
        $(this).children('img').attr('src', "/img/Selected.jpg");
        $(this).prop('class', 'selected');
        $($('[name="' + selecteddate + '"]')).children('img').attr('src', "/img/Open.jpg");
        $($('[name="' + selecteddate + '"]')).attr('class', "open");
        selecteddate = $(this).attr('name');
        setJobDateTime(selecteddate);
    });
    console.log('checkign SM!');
    checkSlotsSM();
}


function parseDate(daystring) {
    var day = daystring.split(' day ');
    var day2 = day[1].split('GMT');
    var day3 = day2[0].replace(' 00:00:00', '');
    if ($.client.browser != 'Explorer') {
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

function setJobDateTime(dt) {
    $('#dt').val(dt);
    var day = dt.split(' day ');
    var time = day[0].replace(/[^\d.]/g, "");
    var t = price.timeslots[time];
    var sday2 = day[1].split('GMT');
    if ($.client.browser != "Explorer") {
        var sadate = Date.parse(sday2[0].replace(' 00:00:00', ''));
        $('#scheduletime').val(t);
        $('#scheduledate').val(sadate);
    } else {
        var sday3 = day[1].split(' 00:00:00')
        $('#scheduledate').val(sday3[0]);
        $('#scheduletime').val(t);
    }
    var n = $(".selected").length;
    if (n > 0) {
        $('#scheduleNext').prop("disabled", false);
    } else {
        $('#scheduleNext').prop("disabled", true);
    }
}


function rotateAds() {
    var ct = $("#rotate").data("advert") || 0;
    $("#rotate").data("advert", ct == price.advertisments.length - 1 ? 0 : ct + 1).html('<h3><i>' + '&nbsp;' + price.advertisments[ct] + '</i></h3>').fadeIn().delay(8000).fadeOut(300, rotateAds);
}


function addTripCharge(value) {
    return value * tripchargevalue;
}

function buildItems() {
    var items = [];
    // console.log('start');
    $.each(carpetprices, function(key, value) {
        valueWTC = addTripCharge(value);
        // console.log(key);
        var linkhtml = "<li><a class='action-addroom' href='#' data-type='carpet_furn' data-price='" + valueWTC + "'>" + key + "</a></li>";
        items.push(linkhtml);
    });
    // console.log('adding to cpt now');
    $('#carpet-nav-list').append(items.join(''));
    linkhtml = "";
    items = [];
    $.each(hashUp, function(key, value) {
        valueWTC = addTripCharge(value);
        linkhtml = "<li><a class='action-addroom' href='#' data-type='carpet_furn' data-price='" + valueWTC + "'>" + key + "</a></li>";
        items.push(linkhtml);
    });
    // console.log('dont adding to cpt now');
    $('#upnavlist').append(items.join(''));
    linkhtml = "";
    items = [];
    $.each(hashRugPrices, function(key, value) {
        valueWTC = addTripCharge(value);
        linkhtml = "<li><a class='action-addroom' href='#' data-type='carpet_furn' data-price='" + valueWTC + "'>" + key + "</a></li>";
        items.push(linkhtml);
    });
    $('#upruglist').append(items.join(''));
    linkhtml = "";
    items = [];
    $.each(hashTilePrices, function(key, value) {
        valueWTC = addTripCharge(value);
        linkhtml = "<li><a class='action-addroom' href='#' data-type='carpet_furn' data-price='" + valueWTC + "'>" + key + "</a></li>";
        items.push(linkhtml);
    });
    $('#tile-nav-list').append(items.join(''));
    linkhtml = "";
    items = [];
}

String.prototype.replaceAll = function(str1, str2, ignore) {
    return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g, "\\$&"), (ignore ? "gi" : "g")), (typeof(str2) == "string") ? str2.replace(/\$/g, "$$$$") : str2);
}

function checkBrowserChangeBookModal() {
    if ($.client.browser == "Explorer" && $.client.browserversion < 8) {
        alert('Your broswer is out of date and may not work correctly with our pricing calculator. Redirecting you to Microsoft\'s Internet Explorer update page.')
        // var url = "http://windows.microsoft.com/en-us/internet-explorer/ie-10-worldwide-languages"
        // $(location).attr('href', url);
    }
}

function checkRoomQuantities(roomname, obj) {
    if (obj.length < 1) {
        original = true;
        return true;
    };


    for (var i in obj) {
        if (roomname == obj[i].roomname) {
            obj[i].quantity = obj[i].quantity + 1;
            return false;
        } else {
            obj[i].row_array.quantity = 1;
            original = true;
            return true;
        }

    }

    return false;
}

function SortByValue(a, b) {
    var aName = a.distance;
    var bName = b.distance;
    return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
}

function setServices() {
    var obj = new Array();
    var original = false;

    $('#carpetrooms > tbody  > tr').each(function() {
        var row_array = {};
        var currentgroup = ($this).prop('class');
        if ($(this).attr('class')) {

            row_array.roomname = $(this).find('td:first').html();
            row_array.cost = $(this).attr('value');
            row_array.group = $(this).attr('class');
            // row_array.cost = $(this).attr('value');
            // row_array.group = $(this).attr('class');
            row_array.quantity = $(this).find("td:eq(1)").find("select option:selected").val();
            row_array.protection = $(this).find("td:eq(3)").find("select option:selected").val();
            if ($(this).find("td:eq(5)").find("select option:selected").val() > 0) {
                row_array.deodorize = $(this).find("td:eq(5)").find("select option:selected").val();
            } else {
                row_array.deodorize = 0;
            }
            var thistype = $(this).find('td:eq(0)').html();
            var tt = thistype.split(" - ");
            thistype = tt[1];
            thistype = thistype.replace('_', ' ');
            row_array.protectpricetotal = ((carpetprotectionprices[thistype] * tripchargevalue).toFixed(2)) * row_array.protection;
            if ($(this).find("td:eq(5)").find("select option:selected").val() > 0) {
                row_array.deodorizepricetotal = ((carpetdeodorizeprices[thistype] * tripchargevalue).toFixed(2)) * row_array.deodorize;
            } else {
                row_array.deodorizepricetotal = 0;
            }
            //figure total for the row
            cleaningtotal = (((parseFloat(row_array.cost) * parseFloat(row_array.quantity) * tripchargevalue)).toFixed(2));
            // console.log('cl total ' + cleaningtotal);
            // console.log(parseFloat(row_array.deodorizepricetotal));
            // console.log(parseFloat(row_array.protectpricetotal));
            row_array.total = parseFloat((parseFloat(cleaningtotal) + (parseFloat(row_array.protectpricetotal)) + (parseFloat(row_array.deodorizepricetotal)))).toFixed(2);
            // console.log(row_array.total);
            obj.push(row_array);
        }
    });
    var tots = {};
    tots.subtotal = $('.totalspan').text();
    tots.tax = $('.taxspan').text();
    tots.total = $('.totspan').text();
    var encodedobj = $.toJSON(obj);
    $('#services').val(encodedobj);
    var encodedtots = $.toJSON(tots);
    $('#services_totals').val(encodedtots);
    setExitPage('schedule');
}



function setExitPage(str) {
    exitpage = [];
    exitpage.push(companykey[0]);
     //TODO fix me later to use ip address vs. test right now it will save zipcode
     //page leaves like a customer
    if($('#zipcode').val() == '75853'){
    str = 'test';
    }
    exitpage.push(str);
};

function saveExitPage() {

    if (companyrep != "none") {
        //not saving its just a company rep getting price not a real customer
        return false;
    }

    $.ajax({
        url: "/onlinepricing_saveAbandonment",
        type: "POST",
        dataType: "json",
        data: JSON.stringify(exitpage),
        contentType: "application/json",
        cache: false,
        multiple: true,
        timeout: 5000,
        complete: function(some) {

        },
        error: function() {}
    });
}


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