const express = require('express');
const router  = express.Router();
const productsController = require('../controllers/productsController');
const fileHelpers = require('../../helpers/filesHelpers');
const dataValidation = require('../middlewares/productDataValidation');
const {verifyJWT} = require('../middlewares/verifyJWT');

router.get('/',productsController.listar);

router.get('/mostwanted',productsController.mostwanted);

router.get('/search',productsController.busqueda);

router.get('/:id',productsController.detalle);

router.use(verifyJWT)

router.post('/', dataValidation ,productsController.crear);

router.delete('/:id',productsController.eliminar);

router.put('/:id',productsController.modificar);

module.exports = router;

