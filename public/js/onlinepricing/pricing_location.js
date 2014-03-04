define(['pricing_data', 'pricing_script', 'build_pricing'], function(prd, ps, bp) {
    console.log('loading pl')
    // return {
    //     initialize: function(pd) {
    var pd = prd.getOP();

    function zipCheck(zip) {
        console.log('runnign zipCheck')
        var ziparray = {};
        var distance = {};
        if (zip == "test") {
            zip = '75701';
             ziparray = getTestZipcodes(zip);
            console.log('pd ck ' + pd.companykey)
            prd.setTest('true');
        } else {
             ziparray = pd.validzipcodelist;
            console.log('za length = '+ziparray.length)
        }

        var sortedtripcharges = getTripChargePoints().sort(function(obj1, obj2) {
            return obj2.distance - obj1.distance;
        });
        console.log('sorted tripcharges length -= '+sortedtripcharges.length)
        $.each(ziparray.zip_codes, function(index, element) {
//            console.log('checking zip codes with '+zip +' and '+ element.zip_code)
            if (element.zip_code == zip) {
                console.log('zipcode found')
                distance = element.distance;
                console.log('d ' + element.distance)
                console.log('l ' + distance.length)
            }
        });

        var tcprice;

        if (distance.length < 1) {
            console.log('zipcode found 2')
            $.each(sortedtripcharges, function(index, element) {
                if (distance >= element.distance) {
                    tcprice = element.price;
                    return false;
                } else {

                }
            });
            if (!tcprice) {
                tcprice = 1;
            };

            pd.tripchargevalue = tcprice;
            $('#nozip').hide();
            $('#zipcode').val(zip);
            getCityState(zip);
            $('#zipcodearea').hide();
            $('#pricecalculator').show();
            ps.setExitPage('pricing');
        } else {
            console.log('showing noZip')

            $('#nozip').show();

        }
        ps.fillNavLists();
        bp.addAction();

    }

    $('#zipcodetext').keyup(function(e) {
        e.preventDefault();
        if (e.keyCode == 13) {
            zipCheck($('#zipcodetext').val());
        }

    });

    function getTripChargePoints() {
        var newTripchargearray = [];
        var newTripcharge = new Object();

        for (var k in pd.tripchargearray) {
            newTripcharge.distance = k;
            newTripcharge.price = tripchargearray[k];
            newTripchargearray.push(newTripcharge);
        };
        return newTripchargearray;
    }

    function getTestZipcodes(zip) {


        var somejsonobject = {
            "zip_codes": [{
                "zip_code": "75801",
                "distance": 44.128
            }, {
                "zip_code": "75802",
                "distance": 44.128
            }, {
                "zip_code": "75803",
                "distance": 44.128
            }, {
                "zip_code": "75882",
                "distance": 44.128
            }, {
                "zip_code": "75785",
                "distance": 37.799
            }, {
                "zip_code": "75788",
                "distance": 42.312
            }, {
                "zip_code": "75760",
                "distance": 44.354
            }, {
                "zip_code": "75772",
                "distance": 32.493
            }, {
                "zip_code": "75784",
                "distance": 36.893
            }, {
                "zip_code": "75779",
                "distance": 33.22
            }, {
                "zip_code": "75764",
                "distance": 30.98
            }, {
                "zip_code": "75853",
                "distance": 38.083
            }, {
                "zip_code": "75667",
                "distance": 37.185
            }, {
                "zip_code": "75766",
                "distance": 24.982
            }, {
                "zip_code": "75780",
                "distance": 26.244
            }, {
                "zip_code": "75759",
                "distance": 21.041
            }, {
                "zip_code": "75680",
                "distance": 37.036
            }, {
                "zip_code": "75763",
                "distance": 22.014
            }, {
                "zip_code": "75782",
                "distance": 24.201
            }, {
                "zip_code": "75687",
                "distance": 26.798
            }, {
                "zip_code": "75770",
                "distance": 23.438
            }, {
                "zip_code": "75757",
                "distance": 12.449
            }, {
                "zip_code": "75789",
                "distance": 16.291
            }, {
                "zip_code": "75652",
                "distance": 32.04
            }, {
                "zip_code": "75653",
                "distance": 32.04
            }, {
                "zip_code": "75654",
                "distance": 32.04
            }, {
                "zip_code": "75148",
                "distance": 42.761
            }, {
                "zip_code": "75658",
                "distance": 25.573
            }, {
                "zip_code": "75689",
                "distance": 22.627
            }, {
                "zip_code": "75751",
                "distance": 33.183
            }, {
                "zip_code": "75752",
                "distance": 33.183
            }, {
                "zip_code": "75762",
                "distance": 9.814
            }, {
                "zip_code": "75791",
                "distance": 8.684
            }, {
                "zip_code": "75750",
                "distance": 16.16
            }, {
                "zip_code": "75682",
                "distance": 22.009
            }, {
                "zip_code": "75778",
                "distance": 26.504
            }, {
                "zip_code": "75684",
                "distance": 19.584
            }, {
                "zip_code": "75756",
                "distance": 18.218
            }, {
                "zip_code": "75124",
                "distance": 41.48
            }, {
                "zip_code": "75758",
                "distance": 10.019
            }, {
                "zip_code": "75701",
                "distance": 0.005
            }, {
                "zip_code": "75702",
                "distance": 0.005
            }, {
                "zip_code": "75703",
                "distance": 0.005
            }, {
                "zip_code": "75704",
                "distance": 0.005
            }, {
                "zip_code": "75705",
                "distance": 0.005
            }, {
                "zip_code": "75706",
                "distance": 0.005
            }, {
                "zip_code": "75707",
                "distance": 0.005
            }, {
                "zip_code": "75708",
                "distance": 0.005
            }, {
                "zip_code": "75709",
                "distance": 0.005
            }, {
                "zip_code": "75710",
                "distance": 0.005
            }, {
                "zip_code": "75711",
                "distance": 0.005
            }, {
                "zip_code": "75712",
                "distance": 0.005
            }, {
                "zip_code": "75713",
                "distance": 0.005
            }, {
                "zip_code": "75798",
                "distance": 0.005
            }, {
                "zip_code": "75799",
                "distance": 0.005
            }, {
                "zip_code": "75666",
                "distance": 23.448
            }, {
                "zip_code": "75662",
                "distance": 26.019
            }, {
                "zip_code": "75663",
                "distance": 26.019
            }, {
                "zip_code": "75641",
                "distance": 41.654
            }, {
                "zip_code": "75754",
                "distance": 21.907
            }, {
                "zip_code": "75792",
                "distance": 13.985
            }, {
                "zip_code": "75771",
                "distance": 13.736
            }, {
                "zip_code": "75650",
                "distance": 44.365
            }, {
                "zip_code": "75601",
                "distance": 34.127
            }, {
                "zip_code": "75602",
                "distance": 34.127
            }, {
                "zip_code": "75603",
                "distance": 34.127
            }, {
                "zip_code": "75604",
                "distance": 34.127
            }, {
                "zip_code": "75605",
                "distance": 34.127
            }, {
                "zip_code": "75606",
                "distance": 34.127
            }, {
                "zip_code": "75607",
                "distance": 34.127
            }, {
                "zip_code": "75608",
                "distance": 34.127
            }, {
                "zip_code": "75615",
                "distance": 34.127
            }, {
                "zip_code": "75790",
                "distance": 23.691
            }, {
                "zip_code": "75693",
                "distance": 29.993
            }, {
                "zip_code": "75103",
                "distance": 36.019
            }, {
                "zip_code": "75647",
                "distance": 25.924
            }, {
                "zip_code": "75755",
                "distance": 21.109
            }, {
                "zip_code": "75797",
                "distance": 21.109
            }, {
                "zip_code": "75765",
                "distance": 19.548
            }, {
                "zip_code": "75660",
                "distance": 36.599
            }, {
                "zip_code": "75773",
                "distance": 25.727
            }, {
                "zip_code": "75140",
                "distance": 33.994
            }, {
                "zip_code": "75127",
                "distance": 38.307
            }, {
                "zip_code": "75117",
                "distance": 42.374
            }, {
                "zip_code": "75444",
                "distance": 31.516
            }, {
                "zip_code": "75644",
                "distance": 35.25
            }, {
                "zip_code": "75645",
                "distance": 35.25
            }, {
                "zip_code": "75410",
                "distance": 37.734
            }, {
                "zip_code": "75783",
                "distance": 33.482
            }, {
                "zip_code": "75497",
                "distance": 44.98
            }, {
                "zip_code": "75494",
                "distance": 43.546
            }]
        };
        return somejsonobject;
    }

    var getCityState = function(zip) {
        // console.log('>> getcity first hit zip '+zip)
        // if (zip == "test") {
        //     console.log('>>>>>>>>>>>> setting city state')
        //     $('#city').val("Tyler");
        //     //$('#cityph').attr("placeholder", "Type your answer here");

        //     $("#cityph").val('');
        //     $("#cityph").attr("placeholder", "New placeholder text");
        //     $('#cityph').val('').prop("placeholder","Mot de passe");
        //     $('#state').val("TX");
        //     $('#stateph').attr("placeholder", "Type your answer here");

        //     return;
        // }
        // console.log('past returne')
        $.ajax({
            url: "http://zip.elevenbasetwo.com/v2/US/" + zip,
            context: document.body
        }).complete(function(data) {
            var ar = JSON.parse(data.responseText);
            $('#city').val(ar.city);
            $('#cityph').val('').prop("placeholder", ar.city);

            $('#state').val(ar.state);
            $('#stateph').val('').prop("placeholder", ar.state);

            if (!$('#city').val() || !$('#state').val()) {
                alert('Error: your city is not found');
            }
        });
    };


    $("#zipnextbutton").click(function(event) {
        zipCheck($('#zipcodetext').val());
    });

});