const express = require('express');
const router  = express.Router();
const productsController = require('../controllers/productsController');
const fileHelpers = require('../../helpers/filesHelpers');
const dataValidation = require('../middlewares/productDataValidation');

router.get('/',productsController.listar);

router.get('/mostwanted',productsController.mostwanted);

router.get('/:id',productsController.detalle);

router.post('/',dataValidation ,productsController.crear);

router.delete('/:id', )




module.exports = router;

