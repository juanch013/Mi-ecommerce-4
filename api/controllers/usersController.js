const fileHelpers = require('../../helpers/filesHelpers');

const usersController = {
    listUsers: function(req, res) {
        const users = fileHelpers.getUsers();
        res.stauts(200).send(users);
    }, 
    getUser: function(req, res) {
        
    },
    createUser: function(req, res) {
        
    },
    // login: function(req, res) {
        
    // },
    updateUser: function(req, res) {
        
    },
    deleteUser: function(req, res) {
        
    },
}


router.get('/', usersControlle.listUsers);

router.get('/:id', usersControlle.getUser);

router.post('/', usersControlle.createUser);

//router.post('/login', usersControlle.login);

router.put('/:id', usersControlle.updateUser);

router.delete('/:id', usersControlle.deleteUser);