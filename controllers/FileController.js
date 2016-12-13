const FileModel = require('../models/FileModel.js');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

/**
 * FileController.js
 *
 * @description :: Server-side logic for managing Files.
 */
module.exports = {
  /**
   * FileController.list()
   */
  list(req, res) {
    FileModel.find((err, Files) => {
      if (err) {
        return res.status(500).json({
          message: 'Error when getting File.',
          error: err,
        });
      }
      return res.json(Files);
    });
  },

  /**
   * FileController.show()
   */
  show(req, res) {
    
    const id = req.params.id;
    FileModel.findById(id, (err, File) => { 
      if (err) {
        return res.status(500).json({
          message: 'Error when getting File.',
          error: err,
        });
      }

      if (!File) {
        return res.status(404).json({
          message: 'No such File',
        });
      }

      if(req.query.rel){
    
        FileModel.find({
        '_id': { $in: File.relations}}).lean().exec((err, relations) =>{
        if (err) {
        return res.status(500).json({
          message: 'Error when getting relations.',
          error: err,
        });
      }; 
      
       //relations = [File].concat(relations) 
    
       FileModel.find({relations: ObjectId(id)}).lean().exec((err, Files) => {
        
        if (err) {
        return res.status(500).json({
          message: 'Error when getting File.',
          error: err,
        });
        }
        
        if (!Files) {
        return res.status(404).json({
          message: 'No such File',
        });
      }  
    
        return res.json({horizontal: relations, vertical: Files, mainfile: File});
    });
        });
      }else{
      return res.json(File);
      }
      
        
  });
  
  },

  /**
   * FileController.create()
   */

  create(req, res) {
  
  let rel = [];
  
  if(req.body.relations){
   
   for(let r = 0; r <req.body.relations.length;r++){
    rel.push(new ObjectId(req.body.relations[r])); 
  }
  }
   
    const File = new FileModel({
      name: req.body.name,
      type: req.body.type,
      parent: req.body.parent,
      relations: rel,
      source: req.body.source,
    });

    File.save((err, File) => {
      if (err) {
        return res.status(500).json({
          message: 'Error when creating File',
          error: err,
        });
      }
      return res.status(201).json(File);
    });
  },

  /**
   * FileController.update()
   */
  update(req, res) {
    const id = req.params.id;
    FileModel.findById(id, (err, File) => {
      if (err) {
        return res.status(500).json({
          message: 'Error when getting File',
          error: err,
        });
      }
      if (!File) {
        return res.status(404).json({
          message: 'No such File',
        });
      }

      File.name = req.body.name ? req.body.name : File.name;
      File.type = req.body.type ? req.body.type : File.type;
      File.parent = req.body.parent ? req.body.parent : File.parent;
      File.relations = req.body.relations ? req.body.relations : File.relations;
      File.source = req.body.source ? req.body.source : File.source;

      File.save((err, File) => {
        if (err) {
          return res.status(500).json({
            message: 'Error when updating File.',
            error: err,
          });
        }

        return res.json(File);
      });
    });
  },

  /**
   * FileController.remove()
   */

  remove(req, res) {
    const id = req.params.id;

    FileModel.findByIdAndRemove(id, (err, File) => {
      if (err) {
        return res.status(500).json({
          message: 'Error when deleting the File.',
          error: err,
        });
      }
      return res.status(204).json();
    });
  },
};
