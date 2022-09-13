const express = require('express');
const { cartList, cartEdit } = require('../controllers/cartController');
// const {verifyJWT} = require('../middlewares/verifyJWT');
// const {logErrors, clientErrorHandler} = require('../middlewares/errorHandler');

const router = express.Router();
router.get('/:id', cartList);
router.put('/:id', cartEdit);

module.exports = router;