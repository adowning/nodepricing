//TODO fix me adding global
//var actionR = 0;
define(['pricing_data'], function(prd) {

    console.log('buildpricing loading');
    var addAction = 0;
    var pd = prd.getOP();

    var getCount = function(aVal, myArr) {

        var num = 0;;

        for (i = 0; i < myArr.length; i++) {
            if (myArr[i] == aVal) num++;
        }

        return num;
    }; //end getCount

    var checkValidity = function(item) {

        //seems verbose but allows for high variabilty in activegroup
        //may change later to reduce code
        switch (activegroup) {

            case "Carpet":

                var roomcleaningcost = pd.carpetprices[item],
                    protectprice = pd.carpetprotectionprices[item],
                    deodorizeprice = pd.carpetdeodorizeprices[item];

                if (roomcleaningcost == undefined || protectprice == undefined ||
                    deodorizeprice == undefined) {
                    return false;
                } else {
                    return true;
                }

                break;

            case "Tile":

                var roomcleaningcost = pd.hashTilePrices[item],
                    protectprice = pd.hashTilePricesProt[item];

                if (roomcleaningcost == undefined || protectprice == undefined) {
                    return false;
                } else {
                    return true;
                }

                break;

            case "OrientalRugs":

                var roomcleaningcost = pd.hashRugPrices[item],
                    protectprice = pd.hashRugProt[item],
                    deodorizeprice = pd.hashRugDeod[item];

                if (roomcleaningcost == undefined || protectprice == undefined ||
                    deodorizeprice == undefined) {
                    return false;
                } else {
                    return true;
                }

                break;

            case "Upholstery":

                var roomcleaningcost = pd.hashUp[item],
                    protectprice = pd.hashUpProt[item],
                    deodorizeprice = pd.hashUpDeod[item];

                if (roomcleaningcost == undefined || protectprice == undefined || deodorizeprice == undefined) {
                    return false;
                } else {
                    return true;
                }

                break;

                return true;

        }
    }; //end checkValidity

    var updateTotal = function() {
        var runningcleaningtotal = 0;
        var r = 0;

        $("#carpetrooms tr").each(function() {

            $this = $(this);

            //nasty, make a switch or something
            if (r > 1) {

                var currentgroup = ($this).prop('class'),
                    thistype = $(this).find('td:eq(0)').html(),
                    tt = thistype.split(" - "),
                    thistype = tt[1],
                    thistype = thistype.replace('_', ' ');

                if (currentgroup == "Carpet") {

                    var roomcleaningcost = pd.carpetprices[thistype],
                        protectprice = pd.carpetprotectionprices[thistype],
                        deodorizeprice = pd.carpetdeodorizeprices[thistype];

                }
                if (currentgroup == "Upholstery") {

                    var roomcleaningcost = pd.hashUp[thistype],
                        protectprice = pd.hashUpProt[thistype],
                        deodorizeprice = pd.hashUpDeod[thistype];

                }
                if (currentgroup == "OrientalRugs") {

                    var roomcleaningcost = pd.hashRugPrices[thistype],
                        protectprice = pd.hashRugProt[thistype],
                        deodorizeprice = pd.hashRugDeod[thistype];

                }
                if (currentgroup == "Tile") {

                    var roomcleaningcost = pd.hashTilePrices[thistype],
                        protectprice = pd.hashTilePricesProt[thistype];

                }

                //trip charge added here
                roomcleaningcost = roomcleaningcost * pd.tripchargevalue;
                protectprice = protectprice * pd.tripchargevalue;
                deodorizeprice = deodorizeprice * pd.tripchargevalue;

                var selectValue = $(this).find("td:eq(1)").find("select option:selected").val(),
                    protection = $(this).find("td:eq(3)").find("select option:selected").val() * protectprice,
                    deodorize = $(this).find("td:eq(5)").find("select option:selected").val() * deodorizeprice;

                if (!deodorize || deodorize == 'undefined') {
                    deodorize = 0;
                }

                //tripcharge additions
                runningcleaningtotal = (runningcleaningtotal + (selectValue * roomcleaningcost)) + protection + deodorize;

            }

            r++;

        });

        if (runningcleaningtotal !== 0 && runningcleaningtotal) {

            if (runningcleaningtotal < 99.50) {
                runningcleaningtotal = 99.50;
                $('.mincharge-span').css('background', '#8ec252');
                $('.mincharge-span').html("<div class='alert'>* Minimum charge.</div>");

            } else {

                $('.mincharge-span').text("");

            }

            runningcleaningtotal -= pd.discountvalue;

            var tax = runningcleaningtotal * .0825,
                ftax = parseFloat(tax.toFixed(2)),
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

    }; //end updateTotal

    var clearOut = function(aVal, myArr) {

        while ((_.indexOf(aVal, myArr)) !== -1) {

            myArr.splice(_.indexOf(myArr, aVal), 1);
        }

        return true;
    }

    var amountChangeOptions = function(roomtype_nospace, roomtype) {

        //remove row if we changed clean amount to 0
        if ($('#carpetclean' + roomtype_nospace + ' :selected').val() == 0) {

            $('#carpetclean' + roomtype_nospace + '').parent().parent().remove();
            var index = _.indexOf(pd.activecarpetrooms, roomtype),
                rowCount = $('#carpetrooms tr').length;

            pd.activecarpetrooms.splice(index, 1);


            if (rowCount < 2) {
                $('#carpetrooms').hide();
            } else {
                $('#carpetrooms').show();
            }

            updateTotal();

            return;
        }

        var oldprot = parseInt($("#carpetprotect" + roomtype_nospace + " option:selected").val()),
            olddeod = parseInt($("#carpetdeodorize" + roomtype_nospace + " option:selected").val());
        $('#carpetprotect' + roomtype_nospace + '').children('option:not(:first)').remove();
        $('#carpetdeodorize' + roomtype_nospace + '').children('option:not(:first)').remove();

        clearOut(roomtype, pd.activecarpetrooms);

        for (var i = 0; i < $('#carpetclean' + roomtype_nospace + ' :selected').val(); i++) {
            $('#carpetprotect' + roomtype_nospace + '').append($('<option>', {
                value: i + 1,
                text: i + 1
            }));
            $('#carpetdeodorize' + roomtype_nospace + '').append($('<option>', {
                value: i + 1,
                text: i + 1
            }));

            pd.activecarpetrooms.push(roomtype);
        }

        //TODO FIx me
        // var roomtype_nospace = roomtype.replaceAll(' ', '_');
        // roomtype_nospace = roomtype.replace(/\W/g, '');
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

    }; //end amountChangeOptions

    return {

        addAction: function() {
            console.log('addAction = '+addAction)
            if(addAction != 0 || addAction > 0){
                return;
            }
            $(".action-addroom").click(function(e) {
                console.log('adding action called')

                //prelim check to make sure we have prices for everything, if not
                //were gonna throw an error alert
                if (!checkValidity($(this).html())) {
                    alert('Error! ' + $(this).html());
                    return false;
                }

                switch ($(this).data('type')) {

                    case "carpet_furn":

                        var roomtype = $(this).html(),
                            roomtype_nospace = roomtype.replace(' ', '_'),
                            roomtype_nospace = roomtype.replace(/\W/g, ''),
                            sp = 'Protect';

                        if (activegroup == "Tile") {
                            sp = 'Seal';
                        }

                        if (_.indexOf(pd.activecarpetrooms, $(this).html()) == -1) {

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


                            pd.activecarpetrooms.push(roomtype);

                            var size = getCount(roomtype, pd.activecarpetrooms);

                        } else {

                            pd.activecarpetrooms.push($(this).html());

                            var size = getCount(roomtype, pd.activecarpetrooms),
                                oldprot = parseInt($("#carpetprotect" + roomtype_nospace + " option:selected").val()),
                                olddeod = parseInt($("#carpetdeodorize" + roomtype_nospace + " option:selected").val()),
                                newtotal = parseInt($("#carpetclean" + roomtype_nospace + " option:selected").val()) + parseInt(1);

                            $('#carpetclean' + roomtype_nospace + " option:eq(" + size + ")").prop("selected", true);

                        }

                        //set correct amount to select from for prot and deod
                        //based on how many we have of the roomtype
                        $('#carpetprotect' + roomtype_nospace + '').children('option:not(:first)').remove();

                        $('#carpetdeodorize' + roomtype_nospace + '').children('option:not(:first)').remove();

                        if (size > 10) {
                            size = 10;
                        }

                        for (var i = 0; i < size; i++) {
                            $('#carpetprotect' + roomtype_nospace + '').append($('<option>', {
                                value: i + 1,
                                text: i + 1
                            }));

                            $('#carpetdeodorize' + roomtype_nospace + '').append($('<option>', {
                                value: i + 1,
                                text: i + 1
                            }));
                        }

                        if (oldprot <= newtotal) {
                            $("#carpetprotect" + roomtype_nospace + " option:eq(" + oldprot + ")").prop("selected", true);
                        }

                        if (olddeod <= newtotal) {
                            $("#carpetdeodorize" + roomtype_nospace + " option:eq(" + olddeod + ")").prop("selected", true);
                        }

                        $("#carpetclean" + roomtype_nospace + "").change(function() {
                            amountChangeOptions(roomtype_nospace, roomtype);
                        });

                        $("#carpetprotect" + roomtype_nospace + "").change(function() {
                            updateTotal();
                        });

                        $("#carpetdeodorize" + roomtype_nospace + "").change(function() {
                            updateTotal();
                        });

                        if (activegroup == "Tile") {
                            var row_index = $(this).parent().index('tr');
                            $('#carpetrooms tr:eq(-1) td:last-child').hide();
                            $("#carpetdeodorize" + roomtype_nospace).hide();
                        }

                        $('#carpetrooms').show();

                        updateTotal();

                        break;

                    default:
                }

                e.preventDefault();

            }); //end click define
            addAction ++;
        } //end addAction

    } //end return

}); //end define