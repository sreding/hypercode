/** @module models/File
 * The File Model.
 * Schema:
 * _id            String       required   Unique identifier of the file
 * name           String       required   Name of the file
 * type           String       optional   file type (class or interface)
 * parent         String       optional   Parent file. Default ''
 * relations      [ObjectId]   required   Files that this file is connected with. They should be `_id`s of File Model documents.
 * source         String       required   the source code of the file
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

var FileSchema = new Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['class', 'interface'] },
  parent: { type: String, default: '' },
  relations: [{ type: ObjectId, ref: 'File' }],
  source: { type: String, required: true }
});

module.exports = mongoose.model('File', FileSchema);
