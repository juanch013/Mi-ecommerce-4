const express = require('express');


const { getPicture, getPictures, createPicture, updatePicture, deletePicture } = require('../controllers/picturesController');

const router = express.Router();

///pictures?product=id
router.get('/', getPictures);
router.post('/', createPicture);
// router.put('/pictures/:id', updatePicture);
// router.delete('/pictures/:id', deletePicture);
//Alias /products/:id/pictures
// router.get('/products/:id/pictures', getPictures);
router.get('/:id', getPicture);

module.exports = router;