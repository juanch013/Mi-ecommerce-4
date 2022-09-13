const express = require('express');
const { cartList, cartEdit } = require('../controllers/cartController');
//const {verifyJWT} = require('../middleware/verifyJWT');
//const {errorHandler} = require('../middlewares/errorHandler');

const router = express.Router();
router.get('/:id', cartList);
router.put('/:id', cartEdit);

module.exports = router;