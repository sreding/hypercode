const config = require("../config.js")
const fs = require('fs');

var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
mongoose.Promise = require('bluebird');
mongoose.connect(config.mongoUrl + config.mongoDbName);

require('../models');
let File = mongoose.model('File')


fs.readFile("./weka.json", function(err, data){
	let o = JSON.parse(data)
	// console.log(o[0].name)
	let nameToIdMap={} // used to populate the relations with ObjectId's
	let newFiles=[]
	for(let i=0;i<o.length; i++){
		let file = o[i]
		let id = ObjectId()
		let newFile = new File({
			_id:id,
			name: file.name,
			parent:file.parent ||"",
			source:file.source,
			relations:[]
		})
		nameToIdMap[file.name]=id
		newFiles.push(newFile)
	}

	//populate relations with ObjectId's
	for(let i=0;i<o.length; i++){
		console.log(newFiles[i].name)
		let relations = o[i].relations
		relations.forEach(function(item){
			// console.log(nameToIdMap[item] + `   ${item}`)
			newFiles[i].relations.push(nameToIdMap[item])
		})
	}

	newFiles.forEach(function(item){
		// console.log(item)
		item.save(function(err,data){
			console.log(err)
			console.log(item.name +"   saved")
		})
	})
	return
})

