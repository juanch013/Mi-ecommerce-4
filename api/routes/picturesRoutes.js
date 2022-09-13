const express = require('express');


const { getPicture, getPictures, createPicture, updatePicture, deletePicture } = require('../controllers/picturesController');

const router = express.Router();

router.get('/', getPictures);
router.post('/', createPicture);
router.put('/:id', updatePicture);
router.delete('/:id', deletePicture);
router.get('/:id', getPicture);
//Alias /products/:id/pictures
// router.get('/products/:id/pictures', getPictures);

module.exports = router;