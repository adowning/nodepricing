var monday = Date.monday();
var tuesday = Date.tuesday();
var wend = Date.wednesday();
var thurs = Date.thursday();
var fri = Date.friday();
var sat = Date.saturday();
var sunday = Date.sunday();

var companykey = "";

function getParameters() {
  var searchString = window.location;
  var st = searchString.toString();
  var parm = st.split('key=');
  var p = parm[1];
  companykey = p;
};


$(document).ready(function () {
    $.ajax({
        url: "/onlinepricing",
        type: "POST",
        dataType: "json",
        // data: {
        //     key: 'go fuck yourself'
        // },
        // contentType: "application/json",
        cache: false,
        timeout: 5000,
        complete: function (some) {
            //called when complete
            // console.log('comp'+some);
            console.log('process complete');
        },

        success: function (some) {

            var obj;
            $.each(some, function (index, element) {

                obj = element;

            });
            console.log(obj.key);
        },

        error: function () {
            console.log('process error');
        },
    });

    getParameters();
});




var zipList = new Array("1", "75701", "75703", "75707","75771", "75704",
    "75706","75792","75708","75702","75709","75707", "75701",
    "75705","75703","75762","75750","75791","75789");

var tripcharges = {'75701':'25', 
                    '75703':'200'};
var tripcharge = 0;

var timeslots = new Array("9:00 am", "11:00 am", "1:00 pm", "3:00 pm");
var activecarpetrooms = new Array();
var tot = 0;
var activegroup = "";
var advertisments = ["Half off tile protector",
        "%20 off carpet protector", "$10 off upholstery cleaning"
];
var base = 0;
var bookedslots = new Array("slot 1 day Fri Apr 05 2013 00:00:00 GMT-0500 (Central Daylight Time)");
var discountvalue = 0;
var browser = "";

var hashPrices = {
    'Bedroom': 39,
    'Living Room': 46,
    'Dining Room': 30,
    'Living/Dining Combo': 55,
    'Hall': 10,
    'Game Room': 48,
    'Misc (0-225)sf': 35,
    'Misc (225-400)sf': 55
}

var hashPricesProt = {
    'Bedroom': 39,
    'Living Room': 46,
    'Dining Room': 30,
    'Living/Dining Combo': 55,
    'Hall': 10,
    'Game Room': 48,
    'Misc (0-225)sf': 35,
    'Misc (225-400)sf': 55
}

var hashPricesDeod = {
    'Bedroom': 39,
    'Living Room': 46,
    'Dining Room': 30,
    'Living/Dining Combo': 55,
    'Hall': 10,
    'Game Room': 48,
    'Misc (0-225)sf': 35,
    'Misc (225-400)sf': 55
}


var hashUp = {
    'Sofa': 75,
    'Recliner': 65,
    'Ottoman': 15,
    'Dining Chair': 15,
    'Loveseat': 55,
    'Wingback Chair': 25,
    'Sectional': 85
}

var hashUpProt = {
    'Sofa': 25,
    'Recliner': 15,
    'Ottoman': 5,
    'Dining Chair': 5,
    'Loveseat': 15,
    'Wingback Chair': 5,
    'Sectional': 25
}

var hashUpDeod = {
    'Sofa': 25,
    'Recliner': 15,
    'Ottoman': 5,
    'Dining Chair': 5,
    'Loveseat': 15,
    'Wingback Chair': 5,
    'Sectional': 25
}

var selecteddate = "";


var couponCodes = {
    '111': '10',
    '112': '20'
};

var hashTilePrices = {
    'Small Area (1-100sf)': 44,
    'Med. Area (101-200sf)': 64,
    'Large Area (201-300sf)': 75
}

var hashTilePricesProt = {
    'Small Area (1-100sf)': 44,
    'Med. Area (101-200sf)': 64,
    'Large Area (201-300sf)': 75
}


var hashRugPrices = {
    'Small Rug (1-50sf)': 70,
    'Med. Rug (51-150sf)': 215,
    'Large Rug (150+ sf)': 325
}

var hashRugProt = {
    'Small Rug (1-50sf)': 70,
    'Med. Rug (51-150sf)': 215,
    'Large Rug (150+ sf)': 325
}

var hashRugDeod = {
    'Small Rug (1-50sf)': 70,
    'Med. Rug (51-150sf)': 215,
    'Large Rug (150+ sf)': 325
}
