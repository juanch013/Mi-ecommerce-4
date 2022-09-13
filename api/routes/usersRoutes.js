const express = require('express');
const usersController = require('../controllers/usersController');

router = express.Router();

router.get('/', usersController.listUsers);

router.get('/:id', usersController.getUser);

router.post('/', usersController.createUser);

//router.post('/login', usersControlle.login);

router.put('/:id', usersController.updateUser);

router.delete('/:id', usersController.deleteUser);

module.exports = router;