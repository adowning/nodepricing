var rows = "";
var companykey = [];

function setParameters() {
  var searchString = window.location;
  st = searchString.toString();
  var parm = st.split('/');
  var p = parm[4];
  var p2 = p.substring(0, 16);
  companykey.push(p2);
};

$(document).ready(function() {
  //TODO bs is hack fixme

  var bs = ["bs"];
  async.series({
      one: function(callback) {
        console.log('1');
        callback(null, 1);
      },
      two: function(callback) {

        $.ajax({
          url: "/updateavailability",
          type: "POST",
          dataType: "json",
          data: JSON.stringify(bs),
          contentType: "application/json",
          cache: false,
          timeout: 5000,
          complete: function(data) {
            console.log('1');
            callback(null, 1);
          },
          success: function(data) {
            $.each(data, function(index, element) {
              rows = element;

            });
          },
          error: function() {}

        })
      },
      three: function(callback) {
        filltable(rows);
        console.log('2');
        callback(null, 1);

      },
    },
    function(err, results) {
      $('td.edit').click(function() {
        $('.ajax').html($('.ajax input').val());
        $('.ajax').removeClass('ajax');
        $(this).addClass('ajax');
        $(this).html('<input id="editbox" size="' + $(this).text().length + '" type="text" value="' + $(this).text() + '">');
        $('#editbox').focus();

      });

      $('td.edit').keydown(function(event) {

        arr = $(this).attr('class').split(" ");
        
        if (event.which == 13) {
          key = $(this).closest('tr').find('td:eq(0)').text();
          console.log(key);
          newvalue = $(this).children("td > input").val();
        
          data = [];
          data[0] = key;
          data[1] = newvalue;
          $(this).children("td > input").blur();
           $(this).children("td > input").select();
          $.ajax({
            url: "/changebasicsettings",
            type: "POST",
            dataType: "json",
            data: JSON.stringify(data),
            contentType: "application/json",
            cache: false,
            timeout: 5000,
            complete: function(some) {

                // $(this).children("td > input").attr('disabled', 'disabled');
                // $(this).children("td > input").removeAttr('disabled');
            },
            success: function(some) {
              $('.ajax').html($('.ajax input').val());
              $('.ajax').removeClass('ajax');
            },
            error: function() {},
          });
        }

      });
    }
  );
});

function filltable(rows) {

    // activemodules : { type: String, required: true, index: { unique: false } },
    // key : { type: String, required: true, index: { unique: true } },
    // url : { type: String, required: true, index: { unique: false } },
    // address : { type: String, required: false, index: { unique: false } },    
    // zipcode : { type: String, required: false, index: { unique: false } },    
    // city : { type: String, required: false, index: { unique: false } },    
    // state : { type: String, required: false, index: { unique: false } },    
    // publicemail : { type: String, required: false, index: { unique: false } },    
    // telephone : { type: String, required: false, index: { unique: false } },    
    // name : { type: String, required: true, index: { unique: true } },
    // tax : { type: String, default: 5, required: false, index: { unique: false } },   
    // radius : { type: String, default: 30, required: false, index: { unique: false } },    
    // ownername : { type: String, required: true, index: { unique: true } },
    // ordertotal : { type: String, required: true, default: 0, index: {unique: false}},
    // slogan : { type: String, default: "It's not just clean, it's Andrews Clean", required: false, index: { unique: false } }   


  var companydata = {
    'Company Name': rows.name,
    'Company Slogan': rows.slogan,
    'Website': rows.url,
    'Address': rows.address,
    'Zipcode': rows.zipcode,
    'City': rows.city,
    'State': rows.state,
    'Telephone': rows.telephone,
    'Public Email': rows.publicemail,
    'Tax Rate': rows.tax,
    'Service Radius (miles from zipcode)': rows.radius
    
  };

  $.each(companydata, function(key, value) {
    $('#basic_settings').find('tbody').append('<tr class="' + key + '" value=' + value + '><td  id=' + key + 'value=' + key + '>' + key + '</td><td class="edit" id=' + value + 'value=' + value + '>' + value + "</td></tr>");

  });

}