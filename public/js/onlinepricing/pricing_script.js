//Pricing calc 
//by ash downing 
//andrewscarpetcleaning.com

define(['pricing_data', 'async', 'json2', 'build_pricing', 'build_schedule'], function(prd, async, JSON, bp, bs) {

    console.log('pricing script loading')

    var pd = prd.getOP();

    $(".submit").click(function(e) {
        pd.setExitPage('complete');
        e.preventDefault();
    });

    $("#scheduleNext").click(function(e) {
        $('#scheduleform').hide();
        $('#contactform').show();
        pd.setExitPage('contactinformation');
        e.preventDefault();
    });

    $("#scheduleBack").click(function(e) {
        $('#scheduleform').hide();
        $('#pricecalculator').show();
        pd.setExitPage('pricing');
    });

    $("#contactSubmit").click(function(e) {
        $('#contacts').hide();
        $('#confirmation').show();
        pd.setExitPage('schedule');
        e.preventDefault();
    });

    $("#contactBack").click(function(e) {
        $('#contactform').hide();
        $('#scheduleform').show();
        pd.setExitPage('schedule');
    });

    $("#priceNext").click(function(e) {
        $('#pricecalculator').hide();
        $('#scheduleform').show();
        setServices();
        pd.setExitPage('schedule');
        e.preventDefault();
    });

    $("#priceBack").click(function(e) {
        $('#pricecalculator').hide();
        $('#zipcodearea').show();
        pd.setExitPage('zipcode');
    });

    $("#confirmationCancel").click(function(e) {
        $('#contacts').hide();
        $('#zipcodearea').show();
        setServices();
        pd.setExitPage('schedule');
        e.preventDefault();
    });

    pd.setExitPage('zipcode');

    if ($('#zipcodetext').val() != "test") {
        window.onbeforeunload = function() {
            saveExitPage();
        };
    }

    $('#timeholder').prop('disabled', 'disabled');
    $(".settime").click(function(e) {
        $('#scheduletime').val($(this).data('time'));
        $('#timeholder').prop('placeholder', ($(this).data('time')));
        e.preventDefault();
    });

    var zip = "none";

    bs.buildStable();

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

    $('.nextweek').on("click", function() {
        bs.addWeek(7);
    });

    $('.lastweek').on("click", function() {

        bs.addWeek(-7);
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

    function rotateAds() {
        var ct = $("#rotate").data("advert") || 0;
        $("#rotate").data("advert", ct == price.advertisments.length - 1 ? 0 : ct + 1).html('<h3><i>' + '&nbsp;' + price.advertisments[ct] + '</i></h3>').fadeIn().delay(8000).fadeOut(300, rotateAds);
    }


    function addTripCharge(value) {
        //le.log('pdtc '+pd.tripchargevalue)
        return value * pd.tripchargevalue;
    }



    String.prototype.replaceAll = function(str1, str2, ignore) {
        return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g, "\\$&"), (ignore ? "gi" : "g")), (typeof(str2) == "string") ? str2.replace(/\$/g, "$$$$") : str2);
    }

    function checkBrowserChangeBookModal() {
        if (pd.browser == "Explorer" && $.client.browserversion < 8) {
            alert('Your broswer is out of date and may not work correctly with our pricing calculator.')
            pd.setExitPage('badbrowser');
            // var url = "http://windows.microsoft.com/en-us/internet-explorer/ie-10-worldwide-languages"
            // $(location).attr('href', url);
        }
    }

    checkBrowserChangeBookModal();

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
                row_array.cleaning_quantity = $(this).find("td:eq(1)").find("select option:selected").val();
                row_array.protection_quantity = $(this).find("td:eq(3)").find("select option:selected").val();

                if ($(this).find("td:eq(5)").find("select option:selected").val() > 0) {
                    row_array.deodorize_quantity = $(this).find("td:eq(5)").find("select option:selected").val();
                } else {
                    row_array.deodorize_quantity = 0;
                }

                var thistype = $(this).find('td:eq(0)').html();
                var tt = thistype.split(" - ");
                thistype = tt[1];
                thistype = thistype.replace('_', ' ');

                switch (row_array.group) {
                    case 'Carpet':
                        row_array.protectpricetotal = pd.carpetprotectionprices[thistype] * row_array.protection_quantity;
                        row_array.deodorizepricetotal = pd.carpetdeodorizeprices[thistype] * row_array.deodorize_quantity;
                        break;

                    case 'Tile':
                        row_array.protectpricetotal = pd.hashTilePricesProt[thistype] * row_array.protection_quantity;
                        row_array.deodorizepricetotal = 0;
                        break;

                    case 'Upholstery':
                        row_array.protectpricetotal = pd.hashUpProt[thistype] * row_array.protection_quantity;
                        row_array.deodorizepricetotal = pd.hashUpDeod[thistype] * row_array.deodorize_quantity;
                        break;

                    case 'OrientalRugs':
                        row_array.protectpricetotal = pd.hashRugProt[thistype] * row_array.protection_quantity;
                        row_array.deodorizepricetotal = pd.hashRugDeod[thistype] * row_array.deodorize_quantity;
                        break;

                    default:
                        console.log('ERROR - BUILDING AT END OF PRICING SCRIPT AND NO GROUP FOUND')
                }

                //figure total for the row
                cleaningtotal = parseFloat(row_array.cost) * parseFloat(row_array.cleaning_quantity);
                row_array.total = (cleaningtotal + row_array.protectpricetotal + row_array.deodorizepricetotal) * pd.tripchargevalue.toFixed(2);
                console.log('rat ' + row_array.total + ' rappt ' + row_array.protectpricetotal + 'radpt ' + row_array.deodorizepricetotal)
                //finally add object to the array that creates the work order page
                obj.push(row_array);

            }

        });

        var tots = {};
        tots.subtotal = $('.totalspan').text();
        tots.tax = $('.taxspan').text();
        tots.total = $('.totspan').text();
        var encodedobj = JSON.stringify(obj);
        var encodedtots = JSON.stringify(tots);

        $('#services').val(encodedobj);
        $('#services_totals').val(encodedtots);
        //this testbool should probably be somewhere else
        console.log('setting testbool to ' + pd.test)
        $('#testbool').val(pd.test);
        pd.setExitPage('schedule');

    }



    function saveExitPage() {
        if (pd.zipcode)
            if (pd.companyrep != "none" || pd.test == "true") {
                //not saving its just a company rep getting price not a real customer
                return false;
            }

        $.ajax({
            url: "/onlinepricing_saveAbandonment",
            type: "POST",
            dataType: "json",
            data: JSON.stringify(pd.exitpage),
            contentType: "application/json",
            cache: false,
            multiple: true,
            timeout: 5000,
            complete: function(some) {

            },

            error: function() {}

        });
    }

    return {

        setExitPage: function(ep) {
            pd.exitpage = ep;
        },

        fillNavLists: function() {
            var items = [];

            $.each(pd.carpetprices, function(key, value) {
                valueWTC = addTripCharge(value);
                var linkhtml = "<li><a class='action-addroom' href='#' data-type='carpet_furn' data-price='" + valueWTC + "'>" + key + "</a></li>";
                items.push(linkhtml);
            });

            $('#carpet-nav-list').append(items.join(''));
            linkhtml = "";
            items = [];

            $.each(pd.hashUp, function(key, value) {
                valueWTC = addTripCharge(value);
                linkhtml = "<li><a class='action-addroom' href='#' data-type='carpet_furn' data-price='" + valueWTC + "'>" + key + "</a></li>";
                items.push(linkhtml);
            });

            $('#upnavlist').append(items.join(''));
            linkhtml = "";
            items = [];
            $.each(pd.hashRugPrices, function(key, value) {
                valueWTC = addTripCharge(value);
                linkhtml = "<li><a class='action-addroom' href='#' data-type='carpet_furn' data-price='" + valueWTC + "'>" + key + "</a></li>";
                items.push(linkhtml);
            });

            $('#upruglist').append(items.join(''));
            linkhtml = "";
            items = [];

            $.each(pd.hashTilePrices, function(key, value) {
                valueWTC = addTripCharge(value);
                linkhtml = "<li><a class='action-addroom' href='#' data-type='carpet_furn' data-price='" + valueWTC + "'>" + key + "</a></li>";
                items.push(linkhtml);
            });

            $('#tile-nav-list').append(items.join(''));
            linkhtml = "";
            items = [];
        }
    }
}); //end of define