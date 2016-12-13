// Import libraries
const config = require('../config.js');
const fs = require('fs');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

// Connect to mongo
mongoose.connect(config.MONGO_URL + config.MONGO_DB);
// Reference objectId
const ObjectId = mongoose.Types.ObjectId;

// Import model
const FileModel = require('../models/FileModel.js');

// drop
fs.readFile('./boat.json', (err, data) => {
  const o = JSON.parse(data);
  // console.log(o[0].name)
  const nameToIdMap = {}; // used to populate the relations with ObjectId's
  const newFiles = [];
  for (let i = 0; i < o.length; i++) {
    const file = o[i];
    const id = ObjectId();
    const newFile = new FileModel({
      _id: id,
      name: file.name,
      parent: file.parent || '',
      source: file.source,
      relations: [],
    });
    nameToIdMap[file.name] = id;
    newFiles.push(newFile);
  }

  // populate relations with ObjectId's
  for (let i = 0; i < o.length; i++) {
    console.log(newFiles[i].name);
    const relations = o[i].relations;
    relations.forEach((item) => {
      // console.log(nameToIdMap[item] + `   ${item}`)
      newFiles[i].relations.push(nameToIdMap[item]);
    });
  }

  newFiles.forEach((item) => {
    // console.log(item)
    item.save((err, data) => {
      console.log(err);
      console.log(`${item.name}   saved`);
    });
  });
});

