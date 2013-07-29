var mongoose = require('mongoose')
  , Schema = mongoose.Schema;
 
var OnlinePriceSchema = new Schema({
	createdAt : { type: Date, default: Date.now },
  	//activemodules : { type: String, required: true, index: { unique: false } },
  	address : { type: String, default: "address" },
  	email : { type: String, default: "email" },
    key : { type: String, required: true }, 
  	name : { type: String, default: "name" },
  	activeservices : { type: Array, default: ["Carpet", "Tile", "Rugs"] },
    ziplist : { type: Array, default: ["00000"] },
    tripcharges : { type: Array, default: [{'00000': 13}] },
    timeslots : { type: Array, default: ["9:00 am", "11:00 am", "1:00 pm", "3:00 pm"] },
    advertisements : { type: Array, default: ["Half off tile protector", "%20 off carpet protector", "%15 off upholstery cleaning"] },
    bookedslots : { type: Array, default: [] },
    carpetprices : { type: Array, default: [{
    'Bedroom': 39,
    'Living Room': 46,
    'Dining Room': 30,
    'Living/Dining Combo': 55,
    'Hall': 10,
    'Game Room': 48,
    'Misc (0-225)sf': 35,
    'Misc (225-400)sf': 55
    }] },
    carpetprotectionprices : { type: Array, default: [{
    'Bedroom': 39,
    'Living Room': 46,
    'Dining Room': 30,
    'Living/Dining Combo': 55,
    'Hall': 10,
    'Game Room': 48,
    'Misc (0-225)sf': 35,
    'Misc (225-400)sf': 55
    }] },
    carpetdeodorizeprices : { type: Array, default: [{
    'Bedroom': 39,
    'Living Room': 46,
    'Dining Room': 30,
    'Living/Dining Combo': 55,
    'Hall': 10,
    'Game Room': 48,
    'Misc (0-225)sf': 35,
    'Misc (225-400)sf': 55
    }] },
    upholsteryprices : { type: Array, default: [{
    'Sofa': 75,
    'Recliner': 65,
    'Ottoman': 15,
    'Dining Chair': 15,
    'Loveseat': 55,
    'Wingback Chair': 25,
    'Sectional': 85
    }] },
    upholsteryprotectionprices : { type: Array, default: [{
    'Sofa': 25,
    'Recliner': 15,
    'Ottoman': 5,
    'Dining Chair': 5,
    'Loveseat': 15,
    'Wingback Chair': 5,
    'Sectional': 25
    }] },
    upholsterydeodorizeprices : { type: Array, default: [{
    'Sofa': 25,
    'Recliner': 15,
    'Ottoman': 5,
    'Dining Chair': 5,
    'Loveseat': 15,
    'Wingback Chair': 5,
    'Sectional': 25
    }] },
    couponcodes : { type: Array, default: [{"111": "10"}] },
    tileprices : { type: Array, default: [{
    'Small Area (1-100sf)': 44,
    'Med Area (101-200sf)': 64,
    'Large Area (201-300sf)': 75
    }] },
    tilesealerprices : { type: Array, default: [{
    'Small Area (1-100sf)': 44,
    'Med Area (101-200sf)': 64,
    'Large Area (201-300sf)': 75
    }] },
    rugprices : { type: Array, default: [{
    'Small Rug (1-50sf)': 70,
    'Med Rug (51-150sf)': 215,
    'Large Rug (150+ sf)': 325
    }] },
    rugprotectionprices : { type: Array, default: [{
    'Small Rug (1-50sf)': 70,
    'Med Rug (51-150sf)': 215,
    'Large Rug (150+ sf)': 325
    }] },
    rugdeodorizeprices : { type: Array, default: [{
    'Small Rug (1-50sf)': 70,
    'Med Rug (51-150sf)': 215,
    'Large Rug (150+ sf)': 325
    }] },
});


module.exports = mongoose.model('OnlinePrice', OnlinePriceSchema);
