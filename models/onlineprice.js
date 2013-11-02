var mongoose = require('mongoose')
  , Schema = mongoose.Schema;
 
var OnlinePriceSchema = new Schema({
	createdAt : { type: Date, default: Date.now },
  	//activemodules : { type: String, required: true, index: { unique: false } },
  	address : { type: String, default: "address" },
  	email : { type: Array, default: ['email1', 'email2'] },
    key : { type: String, required: true }, 
  	name : { type: String, default: "name" },
  	activeservices : { type: Array, default: ["Carpet", "Tile", "Rugs"] },
    zipcode : { type: Array, default: ["0"] },
    tripcharges : { type: Array, default: [{'0': "13"}] },
    timeslots : { type: Array, default: ["9:00 am", "11:00 am", "1:00 pm", "3:00 pm"] },
    advertisements : { type: Array, default: ["Half off tile protector", "%20 off carpet protector", "%15 off upholstery cleaning"] },
    bookedslots : { type: Array, default: [] },
    carpetprices : { type: Array, default: [{
    'Bedroom': 39,
    'Living Room': 49,
    'Dining Room': 30,
    'Living/Dining Combo': 55,
    'Hall': 10,
    'Game Room': 52,
    'Misc (0-225)sf': 35,
    'Misc (225-400)sf': 55
    }] },
    carpetprotectionprices : { type: Array, default: [{
    'Bedroom': 15,
    'Living Room': 15,
    'Dining Room': 15,
    'Living/Dining Combo': 15,
    'Hall': 5,
    'Game Room': 15,
    'Misc (0-225)sf': 15,
    'Misc (225-400)sf': 15
    }] },
    carpetdeodorizeprices : { type: Array, default: [{
    'Bedroom': 15,
    'Living Room': 15,
    'Dining Room': 15,
    'Living/Dining Combo': 15,
    'Hall': 5,
    'Game Room': 15,
    'Misc (0-225)sf': 15,
    'Misc (225-400)sf': 15
    }] },
    upholsteryprices : { type: Array, default: [{
    'Sofa': 69,
    'Recliner': 65,
    'Ottoman': 15,
    'Dining Chair': 15,
    'Loveseat': 65,
    'Wingback Chair': 35,
    'Sectional': 95
    }] },
    upholsteryprotectionprices : { type: Array, default: [{
    'Sofa': 10,
    'Recliner': 5,
    'Ottoman': 5,
    'Dining Chair': 5,
    'Loveseat': 5,
    'Wingback Chair': 5,
    'Sectional': 10
    }] },
    upholsterydeodorizeprices : { type: Array, default: [{
    'Sofa': 10,
    'Recliner': 5,
    'Ottoman': 5,
    'Dining Chair': 5,
    'Loveseat': 5,
    'Wingback Chair': 5,
    'Sectional': 10
    }] },
    couponcodes : { type: Array, default: [{"111": "10"}] },
    tileprices : { type: Array, default: [{
    'Small Area (1-200sf)': 50,
    'Med Area (101-300sf)': 75,
    'Large Area (300sf plus)': 95
    }] },
    tilesealerprices : { type: Array, default: [{
    'Small Area (1-200sf)': 25,
    'Med Area (101-300sf)': 35,
    'Large Area (300sf plus)': 45
    }] },
    rugprices : { type: Array, default: [{
    'Small Rug (1-50sf)': 45,
    'Med Rug (51-150sf)': 120,
    'Large Rug (150+ sf)': 190
    }] },
    rugprotectionprices : { type: Array, default: [{
    'Small Rug (1-50sf)': 10,
    'Med Rug (51-150sf)': 15,
    'Large Rug (150+ sf)': 20
    }] },
    rugdeodorizeprices : { type: Array, default: [{
    'Small Rug (1-50sf)': 45,
    'Med Rug (51-150sf)': 120,
    'Large Rug (150+ sf)': 190
    }] },
    stylesettings : { type: Array, default: [{
    'primary_color': 'green',
    'secondary_color': 'blue'
    }] },
});


module.exports = mongoose.model('OnlinePrice', OnlinePriceSchema);
