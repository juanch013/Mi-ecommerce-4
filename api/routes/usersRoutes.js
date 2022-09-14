const express = require('express');
const usersController = require('../controllers/usersController');

const { verifyJWT } = require('../middlewares/verifyJWT');
const userAuthMiddleware = require('../middlewares/userAuthMiddleware');

const { cartList, cartEdit } = require('../controllers/cartController');




router = express.Router();

router.get('/', verifyJWT, userAuthMiddleware.listUsers, usersController.listUsers);

router.get('/:id', verifyJWT, userAuthMiddleware.getUser, usersController.getUser);

router.post('/', usersController.createUser);

router.post('/login', usersController.login);

router.put('/:id', verifyJWT, userAuthMiddleware.updateUser, usersController.updateUser);

router.delete('/:id', verifyJWT, userAuthMiddleware.deleteUser, usersController.deleteUser);

router.use(verifyJWT)
router.get('/:id/carts', cartList);
router.put('/:id/carts', cartEdit);

module.exports = router;