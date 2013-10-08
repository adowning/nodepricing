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

function setParameters() {
    var searchString = window.location;
     st = searchString.toString();
    var parm = st.split('/');
    var p = parm[4];
    var p2 = p.substring(0,16);
    companykey.push(p2);
};


$(document).ready(function() {

    async.series({
    one: function(callback){
        setParameters();
        console.log('1');
        callback(null, 1);
        
    },
    two: function(callback){
      
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
 console.log('2');
callback(null, 1);
        },
        success: function(some) {
            $.each(some, function(index, element) {
                price = element;

            });
            
              
        },
        error: function() {
        }
    }); 
            
            

    },
    three: function(callback){
        setDataVars();
        console.log('3');
        callback(null, 1);
    },
    four: function(callback){
        $.ajax({
  url: "/js/onlinepricing/pricing_style.js",
  dataType: 'script',
  async: false
}); console.log('4');
        callback(null, 1);
    },
    five: function(callback){
                        $.ajax({
  url: "/js/onlinepricing/pricing_location.js",
  dataType: 'script',
  async: false
});
                console.log('5');         callback(null, 1);
    },
    six: function(callback){
            $.ajax({
  url: "/js/onlinepricing/pricing_script.js",
  dataType: 'script',
  async: false
}); console.log('6');
            callback(null, 1);
    }
},
function(err, results) {
     $('#zipnextbutton').attr("disabled", false);
    $('#scheduleNext').attr("disabled", true);
});
//    getParameters();

//     $.ajax({
//         url: "/onlinepricing",
//         type: "POST",
//         dataType: "json",
//         data: JSON.stringify(companykey),
//         contentType: "application/json",
//         cache: false,
//         multiple: true,
//         timeout: 5000,
//         complete: function(some) {
//             $.ajax({
//   url: "/js/onlinepricing/pricing_style.js",
//   dataType: 'script',
//   async: false
// });            $.ajax({
//   url: "/js/onlinepricing/pricing_location.js",
//   dataType: 'script',
//   async: false
// });
//             $.ajax({
//   url: "/js/onlinepricing/pricing_script.js",
//   dataType: 'script',
//   async: false
// });
//         },
//         success: function(some) {
//             $.each(some, function(index, element) {
//                 price = element;

//             });
//             setDataVars();
//         },
//         error: function() {
//         }
//     });


});


function setDataVars() {
    //TODO this sucks redo
    companyzipcode = price.companyzipcode;
    stylesettings = price.stylesettings[0];
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
}

// var zipList = new Array("1", "75701", "75703", "75707","75771", "75704",
//     "75706","75792","75708","75702","75709","75707", "75701",
//     "75705","75703","75762","75750","75791","75789");

//var tripcharges = {'75701':'25', 
//                    '75703':'200'};
var tripcharge = 0;
var selecteddate = "";


var couponCodes = {
    '111': '10',
    '112': '20'
};
// var timeslots = new Array("9:00 am", "11:00 am", "1:00 pm", "3:00 pm");
var activecarpetrooms = new Array();
var tot = 0;
var activegroup = "";
// var advertisments = ["Half off tile protector",
//         "%20 off carpet protector", "$10 off upholstery cleaning"
// ];
var base = 0;
// var bookedslots = new Array("slot 1 day Fri Apr 05 2013 00:00:00 GMT-0500 (Central Daylight Time)");
var discountvalue = 0;
var browser = "";
