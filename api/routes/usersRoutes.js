const express = require('express');
const usersController = require('../controllers/usersController');

router = express.Router();

router.get('/', usersControlle.listUsers);

router.get('/:id', usersControlle.getUser);

router.post('/', usersControlle.createUser);

//router.post('/login', usersControlle.login);

router.put('/:id', usersControlle.updateUser);

router.delete('/:id', usersControlle.deleteUser);

module.exports = router;