const fileHelpers = require('../../helpers/filesHelpers');

const validateUserFilds = (userObject) => {
    {email, username, password, firstname, lastname, profilepic} = userObject;

    if(typeof email     === 'string' && 
       typeof username  === 'string' && 
       typeof password  === 'string' && 
       typeof firstname === 'string' && 
       typeof lastname  === 'string' &&
       typeof role      === 'string' &&
      (typeof profilepic  === 'string' || typeof profilepic === 'undefined'))
    {
       return true;
    }
    return false;
}

const usersController = {
    listUsers: function(req, res) {
        const users = fileHelpers.getUsers();
        res.stauts(200).send(users);
    }, 

    getUser: function(req, res) {
        const users = fileHelpers.getUsers();
        const userId = req.params.id;
        const userIndex = userId - 1;

        if(!(userIndex < users.length))
        {
            return res.stauts(404).json({"msg": "Bad request: User does not exists."})
        }
        if(users[userIndex].id !== userId)
        {
            return res.stauts(500).send({"msg" : "Database error: Please, notify server admin."});
        }
        return res.stauts(200).json(users[userIndex]);

    },

    createUser: function(req, res) {
        const users = fileHelpers.getUsers();
        const userFromRequest = req.body;
        if(validateUser(userFromRequest)
        {
            const idToAdd = users.length;
            const userToAdd = {idToAdd, ...userFromRequest};
            users.push(userToAdd);
            res.status(201).json(userToAdd);
            fileHelpers.guardarUsers(users, res);

        }else
        {
            res.status(400).
        }
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