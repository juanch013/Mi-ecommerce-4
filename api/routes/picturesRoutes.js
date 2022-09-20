const express = require('express');
const db = require('../database/models');
const {
	getPicture,
	getPictures,
	createPicture,
	updatePicture,
	deletePicture,
} = require('../controllers/picturesController');
const {
	getProductPicturesSchema,
	byIdSchema,
	createSchema,
	updateSchema,
} = require('../schemas/picturesSchema');

// Middlewares
const { verifyJWT } = require('../middlewares/verifyJWT');
const validatorHandler = require('../middlewares/validatorHandler');

const router = express.Router();

router.use(verifyJWT);

router.get(
	'/',
	validatorHandler(getProductPicturesSchema, 'query'),
	getPictures
);

router.get('/ruta-prueba', async (req, res) => {
	try {
		const createPicture = await db.Picture.create({
      picture_url: 'https://www.google.com',
    });
		res.send('Picture Creada');
	} catch (err) {
		console.log('Err', err);
		res.send('Completa todos los datos requeridos');
	}
});

router.get('/:id', validatorHandler(byIdSchema, 'params'), getPicture);

router.post('/', validatorHandler(createSchema, 'body'), createPicture);

router.put(
	'/:id',
	validatorHandler(byIdSchema, 'params'),
	validatorHandler(updateSchema, 'body'),
	updatePicture
);

router.delete('/:id', validatorHandler(byIdSchema, 'params'), deletePicture);

module.exports = router;
