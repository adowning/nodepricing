$('#zipcodetext').keyup(function(e) {
    e.preventDefault();
    if (e.keyCode == 13) {
        zipCheck($('#zipcodetext').val());
    }

});

function zipCheck(zip) {
    var ziparray = getValidZipcodes(zip);
    var i = 0;
    var sortedtripcharges = getTripChargePoints().tripcharges.sort(function(obj1, obj2) {
        return obj1.distance - obj2.distance;
    });

    var distance;

    $.each(ziparray.zip_codes, function(index, element) {
        ts = element;
        if (ts.zip_code == zip) {
            console.log('gotcha');
            distance = ts.distance;
            console.log(ts.distance);
        }
        i++;
    });

    var tcprice;

    if (distance) {
        $.each(sortedtripcharges, function(index, element) {
            console.log('>' + distance + ' > ' + element.distance);
            if (distance < element.distance) {
                tcprice = element.price;
                console.log('trip charge is ' + element.price);
                return false;
            }
        });
        if (!tcprice) {
            tcprice = 0
        };
        console.log('done and my trip charge price is ' + tcprice);
        $('#nozip').hide();
        console.log('setting zip to ' + zip);
        $('#zipcode').val(zip);
        console.log($('#zipcode').val());
        getCityState(zip);
        $('#zipcodearea').hide();
        $('#pricecalculator').show();
        //$("#pricecalculator").css({"visibility": "show"});
    } else {
        console.log('zipnotfound');
        $('#nozip').show();

    }

}

function getTripChargePoints() {
    var someobject = {
        "tripcharges": [{
            "distance": 5,
            "price": 5
        }, {
            "distance": 19,
            "price": 19
        }]
    };
    return someobject;

}

function getValidZipcodes(zip) {
    //js-eWLI7VA9L3Sinm5VEl6IwoImCqPSsGPGCApJw0Th3Lzr8EmMZsuwRdStEHm7obN1
    //http:zipcodedistanceapi.redline13.com/rest/<api_key>/radius.<format>/<zip_code>/<distance>/<units>.
    //P7ojgTr5FJkIbrbF9h9LYk9JehUk6rXVylfPfHUVqeDCGPhP6qB5LKPZ1Jk8ai4J
    try{
    $.get("http://zipcodedistanceapi.redline13.com/rest/js-qtef5ioDN2d4NGSFdXv93EUWyQXxIsr9WFo1XNELPSQCzIiNGOWJsRG0IDyr6ZA2/radius.json/75701/30/mile", function(data){
    //$.get("http:zipcodedistanceapi.redline13.com/rest/8MDTcVrv9d5qdbDtNaSHYtF3yF4j87WgTAa5vBBFPG53SIxFTpnST2VsI0MQ7I71/radius.json/75701/30/mile", function(data) {
    // $.get("https://www.zipwise.com/webservices/radius.php?key=f1r2xqazuwf0os6g&zip=92626&radius=2", function (data){
        //alert("Data Loaded: " + data);
    });
}
catch(err){
    console.log('error caught --- '+err);
}
    // TODO this is a big ass hack until we get alive addy and feel like dealing with it
    console.log('incoming zip ' + zip);
    var somejsonobject = {
        "zip_codes": [{
            "zip_code": "75701",
            "distance": 0.007
        }, {
            "zip_code": "75702",
            "distance": 0.007
        }, {
            "zip_code": "75703",
            "distance": 0.007
        }, {
            "zip_code": "75704",
            "distance": 0.007
        }, {
            "zip_code": "75705",
            "distance": 0.007
        }, {
            "zip_code": "75706",
            "distance": 0.007
        }, {
            "zip_code": "75707",
            "distance": 0.007
        }, {
            "zip_code": "75708",
            "distance": 0.007
        }, {
            "zip_code": "75709",
            "distance": 0.007
        }, {
            "zip_code": "75710",
            "distance": 0.007
        }, {
            "zip_code": "75711",
            "distance": 0.007
        }, {
            "zip_code": "75712",
            "distance": 0.007
        }, {
            "zip_code": "75713",
            "distance": 0.007
        }, {
            "zip_code": "75798",
            "distance": 0.007
        }, {
            "zip_code": "75799",
            "distance": 1.007
        }]
    };
    //console.log('hai');
    //console.log(somejsonobject.zip_codes[1].zip_code);
    //var result = JSON.parse(somejsonobject);
    //console.log(result.length);
    //console.log('>>>'+somejsonobject[1].zip_codes.zip_code);
    return somejsonobject;

}

function getCityState(zip) {
    var client = new XMLHttpRequest();
    client.open("GET", 'http://zip.elevenbasetwo.com/v2/US/' + '75701', true);
    client.onreadystatechange = function() {
        if (client.readyState == 4) {
            var result = JSON.parse(client.responseText);
            //alert(result.state);
            $('#city').val(result.city);
            $('#state').val(result.state);
        };
    };
    client.send();
};