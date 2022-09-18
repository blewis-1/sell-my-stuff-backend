const express = require('express');
const stuffController = require('../controllers/stuffController');
const auth = require('../middleware/auth');
const multerConfig = require('../middleware/multer-config');

const router = express.Router();

router.post('/', auth, multerConfig, stuffController.createThing);
router.get('/', auth, stuffController.getAllThing);
router.get('/:id', auth, stuffController.getSingleThing);
router.put('/:id', auth, multerConfig, stuffController.updateThing);
router.delete('/:id', auth, stuffController.deleteThing);

module.exports = router;