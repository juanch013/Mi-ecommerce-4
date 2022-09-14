const express = require('express');
const usersController = require('../controllers/usersController');
const { cartList, cartEdit } = require('../controllers/cartController');
const {verifyJWT} = require('../middlewares/verifyJWT');



router = express.Router();

router.get('/', usersController.listUsers);

router.get('/:id', usersController.getUser);

router.post('/', usersController.createUser);

router.post('/login', usersController.login);

router.put('/:id', usersController.updateUser);

router.delete('/:id', usersController.deleteUser);

router.use(verifyJWT)
router.get('/:id/carts', cartList);
router.put('/:id/carts', cartEdit);

module.exports = router;