const FileModel = require('../models/FileModel.js');

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
    FileModel.findOne({ _id: id }, (err, File) => {
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
      return res.json(File);
    });
  },

  /**
   * FileController.create()
   */
  create(req, res) {
    const File = new FileModel({
      name: req.body.name,
      type: req.body.type,
      parent: req.body.parent,
      relations: req.body.relations,
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
    FileModel.findOne({ _id: id }, (err, File) => {
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