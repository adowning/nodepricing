var price = "";
var monday = Date.monday();
var tuesday = Date.tuesday();
var wend = Date.wednesday();
var thurs = Date.thursday();
var fri = Date.friday();
var sat = Date.saturday();
var sunday = Date.sunday();
var companykey = "";
var zipList;
var tripchargearray = new Array();
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
var companykey = [];
var st;
var exitpage = [];
var companyrep = "none";
var distance;
var servicemonster;
var timeslots = new Array();


function setParameters() {
    var searchString = window.location;
    st = searchString.toString();
    var parm = st.split('/');
    var p = parm[4];
    var p2 = p.substring(0, 16);
    companykey.push(p2);
};


$(document).ready(function() {

    async.series({
            one: function(callback) {
                setParameters();
                callback(null, 1);

            },
            two: function(callback) {

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



            },
            three: function(callback) {
                setDataVars();
                callback(null, 1);
            },
            four: function(callback) {
                $.ajax({
                    url: "/js/onlinepricing/pricing_style.js",
                    dataType: 'script',
                    async: false
                });

                $.ajax({
                    url: "http://zipcodedistanceapi.redline13.com/rest/js-TxGYdH8rWGzmMCcUp5CR0rICKGeEQC3KaKInsRPoyoLk0Yeq4Qh4i0H3GVHxyLhI/radius.json/75701/30/mile",
                    success: function(some) {
                        // $.each(some, function(index, element) {
                        //     validzipcodelist = element;
                        // });
                        validzipcodelist = some;
                    },
                    complete: function(some) {
                        //validzipcodelist = "comp";
                    },
                    error: function(err) {
                        validzipcodelist = "err";
                    },
                    dataType: "json",
                    async: false
                });

                callback(null, 1);
            },
            five: function(callback) {


                $.ajax({
                    url: "/js/onlinepricing/pricing_location.js",
                    dataType: 'script',
                    async: false
                });



                callback(null, 1);
            },
            six: function(callback) {
                $.ajax({
                    url: "/js/onlinepricing/pricing_script.js",
                    dataType: 'script',
                    async: false
                });
                callback(null, 1);
            }
        },
        function(err, results) {
            $('#zipnextbutton').attr("disabled", false);
            $('#scheduleNext').attr("disabled", true);
        });
});


function setDataVars() {
    //TODO this sucks redo
    servicemonster = price.servicemonster;
    companyzipcode = price.companyzipcode;
    stylesettings = price.stylesettings[0];
    timeslots = price.timeslots;
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
var browser = "";