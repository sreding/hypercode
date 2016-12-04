const express = require('express');

const router = express.Router();
const FileController = require('../controllers/FileController.js');

/*
 * GET
 */
router.get('/', FileController.list);

/*
 * GET
 */
router.get('/:id', FileController.show);

/*
 * POST
 */
router.post('/', FileController.create);

/*
 * PUT
 */
router.put('/:id', FileController.update);

/*
 * DELETE
 */
router.delete('/:id', FileController.remove);

module.exports = router;
