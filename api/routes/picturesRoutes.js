const express = require('express');
const {
	getPicture,
	getPictures,
	createPicture,
	updatePicture,
	deletePicture,
} = require('../controllers/picturesController');

const { verifyJWT } = require('../middlewares/verifyJWT');

const router = express.Router();

router.get('/', verifyJWT, getPictures);
router.post('/', verifyJWT, createPicture);
router.put('/:id', verifyJWT, updatePicture);
router.delete('/:id', verifyJWT, deletePicture);
router.get('/:id', verifyJWT, getPicture);
//Alias /products/:id/pictures
// router.get('/products/:id/pictures', getPictures);

module.exports = router;
