//Pricing calc 
//by ash downing 
//andrewscarpetcleaning.com


$(window).load(function(){
    $('#zipModal').show();
});

$(document).ready(function () {
    var localkey = getParameters();


    $('#timeholder').prop('disabled', 'disabled');
    $(".settime").click(function (e) {
        $('#scheduletime').val($(this).data('time'));
        $('#timeholder').prop('placeholder', ($(this).data('time')));
        e.preventDefault();
    });
    var zip = "none";
    //TODO hacked and needs fixed
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

    //TODO this sucks redo
    // $.each(price.carpetprices, function (index, element){
    //     carpetprices = element;
    // });
    // $.each(price.carpetprotectionprices, function (index, element){
    //     carpetprotectionprices = element;
    // });
    // $.each(price.carpetdeodorizeprices, function (index, element){
    //     carpetdeodorizeprices = element;
    // });    

    // $.each(price.upholsteryprices, function (index, element){
    //     hashUp = element;
    // });
    // $.each(price.upholsteryprotectionprices, function (index, element){
    //     hashUpProt = element;
    // });
    // $.each(price.upholsterydeodorizeprices, function (index, element){
    //     hashUpDeod = element;
    // });

    // $.each(price.tileprices, function (index, element){
    //     hashUp = element;
    // });
    // $.each(price.tilesealerprices, function (index, element){
    //     hashUpProt = element;
    // });

    // $.each(price.rugprices, function (index, element){
    //     hashUpDeod = element;
    // });
    // $.each(price.rugprotectionprices, function (index, element){
    //     hashUpDeod = element;
    // });
    // $.each(price.rugdeodorizeprices, function (index, element){
    //     hashUpDeod = element;
    // });


    buildItems();
    addAction();
    buildStable();


Number.prototype.formatMoney = function (c, d, t) {
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
  if(p = "" || !p){
    //TODO redirect to 404
  }
  return p;
}

$('.nextweek').on("click", function () {
    console.log('pussy');
    addWeek(7);
});

$('.lastweek').on("click", function () {

    addWeek(-7);
});



 $('.collapse').on('show', function () {
    console.log('setting ag');
    console.log('active group =' + $(this).parent().find('.accordion-toggle').text().replace(/[^A-Za-z]+/g, ''));
    activegroup = $(this).parent().find('.accordion-toggle').text().replace(/[^A-Za-z]+/g, '');
});

$('.collapse').on('hide', function () {
    $(this).parent().find('a').removeClass('open'); //remove active state to button on close
});

    $(rotateAds);
 checkBrowserChangeBookModal();
   
});





$('#zipcode').keyup(function (e) {
    e.preventDefault();
    if (e.keyCode == 13) {
        zipCheck($('#zipcode').val());

    }

});

$('#couponBut').click(function (e) {
    e.preventDefault();
    setCouponCode($('#coupon').val());

});
$('#coupon').bind("enterKey", function (e) {
    e.preventDefault();
    setCouponCode($('#coupon').val());

});

$('#coupon').keyup(function (e) {
    e.preventDefault();
    if (e.keyCode == 13) {
        $(this).trigger("enterKey");

    }

});

function checkValidity(item) {
    console.log('checking val');
    //seems verbose but allows for high variabilty in activegroup
    //may change later to reduce code
    switch (activegroup) {
    case "Carpet":
        console.log('hai');
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
    console.log('adding action');
    $(".action-addroom").click(function (e) {

        //prelim check to make sure we have prices for everything, if not
        //were gonna throw an error alert

        if (!checkValidity($(this).html())) {
            alert('Error!');
            return false;
        }
        switch ($(this).data('type')) {

        case "carpet_furn":
            var roomtype = $(this).html();
            console.log(roomtype);
            //var roomtype_nospace = roomtype.replaceAll(' ', '_');
            var roomtype_nospace = roomtype.replace(/\W/g, '');
            console.log('rtns'+roomtype_nospace);
            sp = 'Protect';
            if(activegroup == "Tile"){
                sp = 'Seal';
            }
            if (_.indexOf(activecarpetrooms, $(this).html()) == -1) {
                $('#carpetrooms').find('tbody').append('<tr class="' + activegroup + '" value=' + $(this).data('price') + '><td id="roomcell" name="roomcell">' + activegroup + " - " + $(this).html() + '</td><td id="selectcell" name="selectcell" ><select class="input-mini" id="carpetclean' + roomtype_nospace + '" class="input-mini"><option>0</option></select></td><td id="optioncell" name="optioncell">Clean</td><td id="selectcell" name="selectcell" ><select  id="carpetprotect' + roomtype_nospace + '"  class="input-mini"><option>0</option></select></td><td id="optioncell" name="optioncell">'+sp+'</td><td id="selectcell" name="selectcell" ><select id="carpetdeodorize' + roomtype_nospace + '"  class="input-mini"><option>0</option></select></td><td id="optioncell-last" name="optioncell-last">Deodorize</td></tr>');
                if(_.indexOf(roomtype_nospace, "Tile") !== -1){
                    console.log('holla');
                    $('td[class*=carpetdeodorize]').hide();
                }
                //fill cleaning select box
                for (var i = 0; i < 10; i++) {
                    // console.log('#carpetclean' + roomtype_nospace + '');
                    $('#carpetclean' + roomtype_nospace + '').append($('<option>', {
                        value: i + 1,
                        text: i + 1
                    }));
                }
                $("#carpetclean" + roomtype_nospace + " option:eq(1)").prop("selected", true);


                activecarpetrooms.push(roomtype);
                var size = getCount(roomtype, activecarpetrooms);
            } else {
                console.log('adding to same row');
                activecarpetrooms.push($(this).html());
                var size = getCount(roomtype, activecarpetrooms);
                console.log('size '+size);
                var oldprot = parseInt($("#carpetprotect" + roomtype_nospace + " option:selected").val());
                 var olddeod = parseInt($("#carpetdeodorize" + roomtype_nospace + " option:selected").val());
                var newtotal = parseInt($("#carpetclean" + roomtype_nospace + " option:selected").val()) + parseInt(1);
                console.log(' roomtype_nospace'+ roomtype_nospace);
            console.log('#carpetclean' + roomtype_nospace + " option:eq(" + size + ")");
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
            $("#carpetclean" + roomtype_nospace + "").change(function () {
                amountChangeOptions(roomtype_nospace, roomtype);
            });
            $("#carpetprotect" + roomtype_nospace + "").change(function () {
                updateTotal();
            });
            //if (activegroup == 'Carpet' || activegroup == 'Upholstery') {
                $("#carpetdeodorize" + roomtype_nospace + "").change(function () {
                    updateTotal();
                });
            //}
            if(activegroup == "Tile"){
                $("#carpetrooms tr td:last-child").hide();
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
    console.log('fun amountChangeOptions');
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
     while ((_.indexOf(aVal, myArr)) !==  -1) {
        myArr.splice(_.indexOf(myArr, aVal), 1);
    }

    return true;
}



function updateTotal() {
    var runningcleaningtotal = 0;
    var r = 0;
    $("#carpetrooms tr").each(function () {
        $this = $(this);
        console.log('r '+r);
        if (r > 1) {
            var currentgroup = ($this).prop('class');
            console.log('cur group '+currentgroup);
            var thistype = $(this).find('td:eq(0)').html();
            var tt = thistype.split(" - ");
            thistype = tt[1];
            thistype = thistype.replace('_', ' ');
            if (currentgroup == "Carpet") {
                console.log('hai2u');
                 var roomcleaningcost = carpetprices[thistype];
                 var protectprice = carpetprotectionprices[thistype];
                 var deodorizeprice = carpetdeodorizeprices[thistype];
            console.log('hai23');
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

            var selectValue = $(this).find("td:eq(1)").find("select option:selected").val();
            var protection = $(this).find("td:eq(3)").find("select option:selected").val() * protectprice;
           // if (currentgroup == "Carpet" || currentgroup == "Upholstery") {
            var deodorize = $(this).find("td:eq(5)").find("select option:selected").val() * deodorizeprice;
           if(!deodorize || deodorize == 'undefined'){
            deodorize = 0;
           }
            runningcleaningtotal = (runningcleaningtotal + (selectValue * roomcleaningcost)) + protection + deodorize;
        }
        r++;
        console.log('end');
    });

    if (runningcleaningtotal !== 0 && runningcleaningtotal) {

         if(tripcharge != 0){
            runningcleaningtotal = parseInt(runningcleaningtotal)+parseInt(tripcharge);
          
        }
        console.log(runningcleaningtotal);
        if (runningcleaningtotal < 99.50) {
            runningcleaningtotal = 99.50;
            $('.mincharge-span').html("<div class='alert'>* Minimum charge.</div>");
        } else {
            $('.mincharge-span').text("");
        }
        runningcleaningtotal -= discountvalue;

       

        var tax = runningcleaningtotal * .0825;
        var ftax = parseFloat(tax.toFixed(2));
        tot = parseFloat((ftax + runningcleaningtotal).toFixed(2));
        console.log(Object.prototype.toString.call(runningcleaningtotal));
        $('.totalspan').text((runningcleaningtotal).formatMoney(2, '.', ','));
        $('.taxspan').text((ftax).formatMoney(2, '.', ','));
        //add trip charge
        
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

$('.remove').on("click", function () {
    $(this).closest("tr.deleteRow").remove();
    return false;
});

$('#myTab a').click(function (e) {
    e.preventDefault();
    $(this).tab('show');
});



function zipCheck(zip) {
    
    var tc;
    $.each(price.tripcharges, function (index, element) {
          tc = element;
     });
    
    if ($.inArray(zip, price.ziplist) == -1) {
        $('#nozip').show();

    } else {
        $('#nozip').hide();
        $('#customerZipcode').val(zip);
        $('#zipcodearea').hide();
        $('#pricecalculator').show();
        //see if this zip code incurs a tripcharge
        if(!tc){
            return;
        }
        if(tc[zip]){
            console.log('tc = '+tc[zip]);
            tripcharge = tc[zip];
            updateTotal();
        }else{
            tripcharge = 0;
            updateTotal();
        }

    }
}


function setCouponCode(key) {
    var value = couponCodes[key];
    if (value == undefined) {
        console.log('invalid coupon code attemted');
    } else {
        discountvalue = value;
        $('#discountamount').text(value);
        $('#discountrow').show();
        updateTotal();
    }

}

function getCount(aVal, myArr) {
    num = 0;
    for (i = 0; i < myArr.length; i++) {
        if (myArr[i] == aVal)
            num++;
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
    $.each(price.timeslots, function (index, element) {
          ts = element;
        $("#stable > tbody").append("<tr><td>" +element + "</td><td class='open' name='slot " + i + " day " + monday + "'><img src='/img/Open.jpg' alt='This timeslot is available'></td><td class='open' name='slot " + i + " day " + tuesday + "'><img  src='/img/Open.jpg' alt='This timeslot is available'></td><td class='open' name='slot " + i + " day " + wend + "'><img src='/img/Open.jpg' alt='This timeslot is available'></td><td class='open' name='slot " + i + " day " + thurs + "'><img src='/img/Open.jpg' alt='This timeslot is available'></td><td class='open' name='slot " + i + " day " + fri + "'><img src='/img/Open.jpg' alt='This timeslot is available'></td><td class='open' name='slot " + i + " day " + sat + "'><img src='/img/Open.jpg' alt='This timeslot is available'></td> </tr>");
        i++;
     });
    // //console.log(ts.length);
    // for (var i in ts) {
    //     //console.log(ts[i]);
    //     $("#stable > tbody").append("<tr><td>" +ts[i] + "</td><td class='open' name='slot " + i + " day " + monday + "'><img src='/img/Open.jpg' alt='This timeslot is available'></td><td class='open' name='slot " + i + " day " + tuesday + "'><img  src='/img/Open.jpg' alt='This timeslot is available'></td><td class='open' name='slot " + i + " day " + wend + "'><img src='/img/Open.jpg' alt='This timeslot is available'></td><td class='open' name='slot " + i + " day " + thurs + "'><img src='/img/Open.jpg' alt='This timeslot is available'></td><td class='open' name='slot " + i + " day " + fri + "'><img src='/img/Open.jpg' alt='This timeslot is available'></td><td class='open' name='slot " + i + " day " + sat + "'><img src='/img/Open.jpg' alt='This timeslot is available'></td> </tr>");
    // }

    fillSchedule();
}

function addWeek(delta) {
    console.log(delta);
    console.log(base);
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

function fillSchedule() {

    if(browser == 'old'){
        console.log('old browser found, building diff schedule');
    $(".open").each(function () {
        adate = $(this).prop('name');
        if(!adate || adate == null || adate == 'undefined' ){
            console.log('adate neg');
        } else {
        $(this).children('img').prop('src', "/img/Closed.gif");
        $(this).prop('class', 'closed');
        }

    });
    $('.open').click(function (event) {
        $(this).children('img').prop('src', "/img/Selected.jpg");
        $(this).prop('class', 'selected');
        $($('[name="' + selecteddate + '"]')).children('img').prop('src', "/img/Open.jpg");
        $($('[name="' + selecteddate + '"]')).prop('class', "open");
        selecteddate = $(this).prop('name');
        setJobDateTime(selecteddate);
    });
        return;
    }

    $(".open").each(function () {
        adate = $(this).attr('name');
        if(!adate || adate == null || adate == 'undefined' ){
            console.log('adate neg');
        } else {
            if(parseDate(adate) != 'closed'){
            if (parseDate(adate).isBefore(Date.today().addDays(1))) {
                $(this).children('img').attr('src', "/img/Closed.gif");
                $(this).prop('class', 'closed');
            } else {

                console.log('parsed date was after today');
            }
        }else{
            console.log('date already closed, doing nothing');
        }
        }
        // see what is booked
        for (var i in price.bookedslots) {
            if (price.bookedslots[i] == $(this).prop('name')) {
                $(this).children('img').attr('src', "/img/Closed.gif");
                $(this).prop('class', 'closed');
            }
        }

    })
    $('.open').click(function (event) {
        $(this).children('img').attr('src', "/img/Selected.jpg");
        $(this).prop('class', 'selected');
        $($('[name="' + selecteddate + '"]')).children('img').attr('src', "/img/Open.jpg");
        $($('[name="' + selecteddate + '"]')).attr('class', "open");
        selecteddate = $(this).attr('name');
        setJobDateTime(selecteddate);
    });

}

function parseDate(daystring) {
    var day = daystring.split(' day ');
    var day2 = day[1].split('GMT');
    var day3 = day2[0].replace(' 00:00:00', '');
    if($.client.browser != 'Explorer'){
    var adate = Date.parse(day3);
    if(!adate){
        console.log('date is null');
        return "closed";
    }
}else{
    var adate = Date.parse(day2[0]);
        if(!adate){
        console.log('date is null');
        return "closed";
    }
}
    return adate;
}

function setJobDateTime(dt) {
    var day = dt.split(' day ');
    var time = day[0].replace(/[^\d.]/g, "");
    var t = price.timeslots[time];
    var sday2 = day[1].split('GMT');
    var sadate = Date.parse(sday2[0].replace(' 00:00:00', ''));
    console.log('t '+t);
    $('#scheduletime').val(t);
    $('#scheduledate').val(sadate);

    var n = $(".selected").length;
    if (n > 0) {
        $('#schenext').prop("disabled", false);
    } else {
        $('#schenext').prop("disabled", true);
    }
}


function rotateAds() {
    var ct = $("#rotate").data("advert") || 0;
    $("#rotate").data("advert", ct == price.advertisments.length - 1 ? 0 : ct + 1).html('<h3><i>' + '&nbsp;' + price.advertisments[ct] + '</i></h3>')
        .fadeIn().delay(8000).fadeOut(300, rotateAds);
}



function buildItems() {
    var items = [];
    //should probably clean this up and optimize code
    console.log('builditems');
    
    // $.each(price.carpetprices, function (index, element){
    //     carpetprices = element;
    // });
    $.each(carpetprices, function (key, value) {
        //console.log(key);
        var linkhtml = "<li><a class='action-addroom' href='#' data-type='carpet_furn' data-price='" + value + "'>" + key + "</a></li>";
        items.push(linkhtml);
    });
    $('#carpet-nav-list').append(items.join(''));
    linkhtml = "";
    items = [];
    console.log('2');
    $.each(hashUp, function (key, value) {
       linkhtml = "<li><a class='action-addroom' href='#' data-type='carpet_furn' data-price='" + value + "'>" + key + "</a></li>";
      items.push(linkhtml);
    });
    $('#upnavlist').append(items.join(''));
    linkhtml = "";
    items = [];
    console.log('3');
    $.each(hashRugPrices, function (key, value) {
       linkhtml = "<li><a class='action-addroom' href='#' data-type='carpet_furn' data-price='" + value + "'>" + key + "</a></li>";
      items.push(linkhtml);
    });    
    $('#upruglist').append(items.join(''));
    linkhtml = "";
    items = [];
    console.log('4');
    $.each(hashTilePrices, function (key, value) {
        linkhtml = "<li><a class='action-addroom' href='#' data-type='carpet_furn' data-price='" + value + "'>" + key + "</a></li>";
        items.push(linkhtml);
    });
    $('#tile-nav-list').append(items.join(''));
    linkhtml = "";
    items = [];
    console.log('builditems done');
}

String.prototype.replaceAll = function (str1, str2, ignore) {
    return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g, "\\$&"), (ignore ? "gi" : "g")), (typeof (str2) == "string") ? str2.replace(/\$/g, "$$$$") : str2);
}

function checkBrowserChangeBookModal (){
    if($.client.browser =="Explorer" && $.client.browserversion < 8){
        console.log($.client.browser +" "+$.client.browserversion);
        alert('Your broswer is very out of date and may not work correctly with our pricing calculator.')
    }
}
