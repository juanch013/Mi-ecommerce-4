const express = require('express');

const router = express.Router();

const { getPicture, getPictures, createPicture, updatePicture, deletePicture } = require('../controllers/picturesController');

///pictures?product=id
router.get('/pictures', getPictures);
router.get('/pictures/:id', getPicture);
router.post('/pictures', createPicture);
router.put('/pictures/:id', updatePicture);
router.delete('/pictures/:id', deletePicture);
//Alias /products/:id/pictures
// router.get('/products/:id/pictures', getPictures);

module.exports = router;