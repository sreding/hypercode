const config = require("../config.js")
const fs = require('fs');

var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

fs.readFile("./weka.json", function(err, data){
	let o = JSON.parse(data)
	console.log(o[0].name)
	for(let i=0,i<o.length, i++){
		
	}
})