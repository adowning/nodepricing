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
    "zip_codes": [
        {
            "zip_code": "75801",
            "distance": 44.128
        },
        {
            "zip_code": "75802",
            "distance": 44.128
        },
        {
            "zip_code": "75803",
            "distance": 44.128
        },
        {
            "zip_code": "75882",
            "distance": 44.128
        },
        {
            "zip_code": "75785",
            "distance": 37.799
        },
        {
            "zip_code": "75788",
            "distance": 42.312
        },
        {
            "zip_code": "75760",
            "distance": 44.354
        },
        {
            "zip_code": "75772",
            "distance": 32.493
        },
        {
            "zip_code": "75784",
            "distance": 36.893
        },
        {
            "zip_code": "75779",
            "distance": 33.22
        },
        {
            "zip_code": "75764",
            "distance": 30.98
        },
        {
            "zip_code": "75853",
            "distance": 38.083
        },
        {
            "zip_code": "75667",
            "distance": 37.185
        },
        {
            "zip_code": "75766",
            "distance": 24.982
        },
        {
            "zip_code": "75780",
            "distance": 26.244
        },
        {
            "zip_code": "75759",
            "distance": 21.041
        },
        {
            "zip_code": "75680",
            "distance": 37.036
        },
        {
            "zip_code": "75763",
            "distance": 22.014
        },
        {
            "zip_code": "75782",
            "distance": 24.201
        },
        {
            "zip_code": "75687",
            "distance": 26.798
        },
        {
            "zip_code": "75770",
            "distance": 23.438
        },
        {
            "zip_code": "75757",
            "distance": 12.449
        },
        {
            "zip_code": "75789",
            "distance": 16.291
        },
        {
            "zip_code": "75652",
            "distance": 32.04
        },
        {
            "zip_code": "75653",
            "distance": 32.04
        },
        {
            "zip_code": "75654",
            "distance": 32.04
        },
        {
            "zip_code": "75148",
            "distance": 42.761
        },
        {
            "zip_code": "75658",
            "distance": 25.573
        },
        {
            "zip_code": "75689",
            "distance": 22.627
        },
        {
            "zip_code": "75751",
            "distance": 33.183
        },
        {
            "zip_code": "75752",
            "distance": 33.183
        },
        {
            "zip_code": "75762",
            "distance": 9.814
        },
        {
            "zip_code": "75791",
            "distance": 8.684
        },
        {
            "zip_code": "75750",
            "distance": 16.16
        },
        {
            "zip_code": "75682",
            "distance": 22.009
        },
        {
            "zip_code": "75778",
            "distance": 26.504
        },
        {
            "zip_code": "75684",
            "distance": 19.584
        },
        {
            "zip_code": "75756",
            "distance": 18.218
        },
        {
            "zip_code": "75124",
            "distance": 41.48
        },
        {
            "zip_code": "75758",
            "distance": 10.019
        },
        {
            "zip_code": "75701",
            "distance": 0.005
        },
        {
            "zip_code": "75702",
            "distance": 0.005
        },
        {
            "zip_code": "75703",
            "distance": 0.005
        },
        {
            "zip_code": "75704",
            "distance": 0.005
        },
        {
            "zip_code": "75705",
            "distance": 0.005
        },
        {
            "zip_code": "75706",
            "distance": 0.005
        },
        {
            "zip_code": "75707",
            "distance": 0.005
        },
        {
            "zip_code": "75708",
            "distance": 0.005
        },
        {
            "zip_code": "75709",
            "distance": 0.005
        },
        {
            "zip_code": "75710",
            "distance": 0.005
        },
        {
            "zip_code": "75711",
            "distance": 0.005
        },
        {
            "zip_code": "75712",
            "distance": 0.005
        },
        {
            "zip_code": "75713",
            "distance": 0.005
        },
        {
            "zip_code": "75798",
            "distance": 0.005
        },
        {
            "zip_code": "75799",
            "distance": 0.005
        },
        {
            "zip_code": "75666",
            "distance": 23.448
        },
        {
            "zip_code": "75662",
            "distance": 26.019
        },
        {
            "zip_code": "75663",
            "distance": 26.019
        },
        {
            "zip_code": "75641",
            "distance": 41.654
        },
        {
            "zip_code": "75754",
            "distance": 21.907
        },
        {
            "zip_code": "75792",
            "distance": 13.985
        },
        {
            "zip_code": "75771",
            "distance": 13.736
        },
        {
            "zip_code": "75650",
            "distance": 44.365
        },
        {
            "zip_code": "75601",
            "distance": 34.127
        },
        {
            "zip_code": "75602",
            "distance": 34.127
        },
        {
            "zip_code": "75603",
            "distance": 34.127
        },
        {
            "zip_code": "75604",
            "distance": 34.127
        },
        {
            "zip_code": "75605",
            "distance": 34.127
        },
        {
            "zip_code": "75606",
            "distance": 34.127
        },
        {
            "zip_code": "75607",
            "distance": 34.127
        },
        {
            "zip_code": "75608",
            "distance": 34.127
        },
        {
            "zip_code": "75615",
            "distance": 34.127
        },
        {
            "zip_code": "75790",
            "distance": 23.691
        },
        {
            "zip_code": "75693",
            "distance": 29.993
        },
        {
            "zip_code": "75103",
            "distance": 36.019
        },
        {
            "zip_code": "75647",
            "distance": 25.924
        },
        {
            "zip_code": "75755",
            "distance": 21.109
        },
        {
            "zip_code": "75797",
            "distance": 21.109
        },
        {
            "zip_code": "75765",
            "distance": 19.548
        },
        {
            "zip_code": "75660",
            "distance": 36.599
        },
        {
            "zip_code": "75773",
            "distance": 25.727
        },
        {
            "zip_code": "75140",
            "distance": 33.994
        },
        {
            "zip_code": "75127",
            "distance": 38.307
        },
        {
            "zip_code": "75117",
            "distance": 42.374
        },
        {
            "zip_code": "75444",
            "distance": 31.516
        },
        {
            "zip_code": "75644",
            "distance": 35.25
        },
        {
            "zip_code": "75645",
            "distance": 35.25
        },
        {
            "zip_code": "75410",
            "distance": 37.734
        },
        {
            "zip_code": "75783",
            "distance": 33.482
        },
        {
            "zip_code": "75497",
            "distance": 44.98
        },
        {
            "zip_code": "75494",
            "distance": 43.546
        }
    ]
    };
    //console.log('hai');
    //console.log(somejsonobject.zip_codes[1].zip_code);
    //var result = JSON.parse(somejsonobject);
    //console.log(result.length);
    //console.log('>>>'+somejsonobject[1].zip_codes.zip_code);
    return somejsonobject;

}

function getCityState(zip) {
    //TODO fix me for IE
                $('#city').val("Tyler");
            $('#state').val("TX");
    // var client = new XMLHttpRequest();
    // client.open("GET", 'http://zip.elevenbasetwo.com/v2/US/' + '75701', true);
    // client.onreadystatechange = function() {
    //     if (client.readyState == 4) {
    //         var result = JSON.parse(client.responseText);
    //         //alert(result.state);
    //         $('#city').val(result.city);
    //         $('#state').val(result.state);
    //     };
    // };
    // client.send();
};