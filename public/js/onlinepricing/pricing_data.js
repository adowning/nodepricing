define([
    'jquery',
    'underscore',
    'async',
    'date2'
], function($, _, async, Date) {

    console.log('starting to load up pricing_data');

    var tripchargearray = new Array();
    var companykey = [];
    var price = "";
    var monday = Date.monday();
    var tuesday = Date.tuesday();
    var wend = Date.wednesday();
    var thurs = Date.thursday();
    var fri = Date.friday();
    var sat = Date.saturday();
    var sunday = Date.sunday();
    var zipList;
    var validzipcodelist = "start";
    var carpetprices;
    var carpetprotectionprices;
    var carpetdeodorizeprices;
    var hashUp;
    var hashUpProt;
    var hashUpDeod;
    var hashTilePrices;
    var hashTilePricesProt;
    var hashRugPrices;
    var hashRugProt;
    var hashRugDeod;
    var companyzipcode;
    var stylesettings;
    var st;
    var exitpage = [];
    var companyrep = "none";
    var distance;
    var servicemonster;
    var timeslots = new Array();
    var bookedslots;
    var data = new Object();
    var tripcharge = 0;
    var selecteddate = "";
    var couponCodes = {
        '111': '10',
        '112': '20'
    };
    var activecarpetrooms = new Array();
    var tot = 0;
    var activegroup = "";
    var base = 0;
    var discountvalue = 0;

    function setParameters() {

        var searchString = window.location,
            st = searchString.toString(),
            parm = st.split('/'),
            p = parm[4],
            p2 = p.substring(0, 16);

        companykey.push(p2);

    };

    async.series({

            one: function(callback) {

                setParameters();

                $.ajax({
                    url: "/onlinepricing",
                    type: "POST",
                    dataType: "json",
                    data: JSON.stringify(companykey),
                    contentType: "application/json",
                    cache: false,
                    multiple: true,
                    timeout: 5000,
                    complete: function(some) {

                        callback(null, 1);
                    },
                    success: function(some) {

                        $.each(some, function(index, element) {
                            price = element;

                        });


                    },
                    error: function() {}
                });

                $.ajax({
                    url: "http://zipcodedistanceapi.redline13.com/rest/js-TxGYdH8rWGzmMCcUp5CR0rICKGeEQC3KaKInsRPoyoLk0Yeq4Qh4i0H3GVHxyLhI/radius.json/75701/30/mile",
                    success: function(data) {
                        console.log('setting zipcodelist in pricing_data')
                        validzipcodelist = data;
                        console.log('validzipcodelist.length = '+validzipcodelist.length)

                    },
                    complete: function(data) {

                    },
                    error: function(err) {
                        console.log('error in zipcode get error ' + err);
                        validzipcodelist = "err";
                    },
                    dataType: "json",
                    async: false
                });

            },
            two: function(callback) {
                setDataVars();
                callback(null, 1);
            }
        },
        function(err, results) {

            data.companykey = companykey;
            data.carpetprices = carpetprices;
            data.carpetprotectionprices = carpetprotectionprices;
            data.carpetdeodorizeprices = carpetdeodorizeprices;
            data.activecarpetrooms = activecarpetrooms;
            data.hashUp = hashUp;
            data.hashUpProt = hashUpProt;
            data.hashUpDeod = hashUpDeod;
            data.hashTilePrices = hashTilePrices;
            console.log(hashTilePrices['Large Area (201-300sf)'])
            data.hashRugPrices = hashRugPrices;
            data.hashRugProt = hashRugProt;
            data.hashRugDeod = hashRugDeod;
            data.hashTilePricesProt = hashTilePricesProt;
            console.log(hashTilePricesProt['Large Area (201-300sf)'])
            data.monday = monday;
            data.companyrep = companyrep;
            data.tuesday = tuesday;
            data.wend = wend;
            data.thurs = thurs;
            data.fri = fri;
            data.sat = sat;
            data.sunday = sunday;
            data.timeslots = timeslots;
            data.bookedslots = bookedslots;
            data.test = 'false';
            data.setExitPage = function setExitPage(str) {
                data.exitpage = [];
                data.discountvalue = discountvalue;
                data.selecteddate = selecteddate;
                data.exitpage.push(data.companykey[0]);
                data.validzipcodelist = validzipcodelist;

                //TODO fix me later to use ip address vs. test right now it will save zipcode
                //page leaves like a customer
                if ($('#zipcode').val() == '75853') {

                    var str = 'test';

                }
                data.exitpage.push(str);
            };


            $('#zipnextbutton').attr("disabled", false);
            $('#scheduleNext').attr("disabled", true);

        });

    function setDataVars() {

        //TODO this sucks redo. probably should convert
        //json directly to data var
        data.servicemonster = price.servicemonster;
        companyzipcode = price.companyzipcode;
        stylesettings = price.stylesettings[0];
        timeslots = price.timeslots;
        bookedslots = price.bookedslots;

        $.each(price.carpetprices, function(index, element) {
            carpetprices = element;
        });

        $.each(price.carpetprotectionprices, function(index, element) {
            carpetprotectionprices = element;
        });

        $.each(price.carpetdeodorizeprices, function(index, element) {
            carpetdeodorizeprices = element;
        });

        $.each(price.upholsteryprices, function(index, element) {
            hashUp = element;
        });

        $.each(price.upholsteryprotectionprices, function(index, element) {
            hashUpProt = element;
        });

        $.each(price.upholsterydeodorizeprices, function(index, element) {
            hashUpDeod = element;
        });

        $.each(price.tileprices, function(index, element) {
            hashTilePrices = element;
        });

        $.each(price.tilesealerprices, function(index, element) {
            hashTilePricesProt = element;
        });

        $.each(price.rugprices, function(index, element) {
            hashRugPrices = element;
        });

        $.each(price.rugprotectionprices, function(index, element) {
            hashRugProt = element;
        });

        $.each(price.rugdeodorizeprices, function(index, element) {
            hashRugDeod = element;
        });

        var tcs;

        $.each(price.tripcharges, function(index, element) {
            tcs = element;
        });

        for (var k in tcs) {

            if (typeof tcs[k] !== 'function') {

                tripchargearray.push(tcs[k]);

            }
        }

    }

    return {
        getOP: function() {
            return data;
        },

        setBrowser: function(type, version) {
            data.browsert = type;
            data.browserv = version;
            console.log('set browser version to ' + data.browserv)
            console.log('set browser to ' + data.browsert)
        },

        setTest: function(b) {
            data.test = b;
        }
    }

});