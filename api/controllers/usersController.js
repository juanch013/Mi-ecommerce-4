const fileHelpers = require('../../helpers/filesHelpers');

const validateUserFilds = (userObject) => {
    const {email, username, password, firstname, lastname, profilepic} = userObject;

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

        if(typeof userId !== 'number')
        {
            return res.stauts(400).json({"msg": "Bad request"})
        }
        const userIndex = userId - 1;

        if(!(userIndex < users.length))
        {
            return res.stauts(404).json({"msg": "User does not exists."})
        }
        if(users[userIndex].id !== userId)
        {
            return res.stauts(500).send({"msg" : "Database error: Please, notify server admin."});
        }
        return res.stauts(200).json(users[userIndex]);

    },

    createUser: function(req, res) {
        const userFromRequest = req.body;
        if(!validateUser(userFromRequest))
        {
            return res.status(400).json({"msg": "Bad request"})
        }
        
        let users = fileHelpers.getUsers();
        const idToAdd = users.length;
        const userToAdd = {idToAdd, ...userFromRequest};
        users.push(userToAdd);
        fileHelpers.guardarUsers(users, res);
        return res.status(201).json(userToAdd);
    },

    // login: function(req, res) {
        
    // },

    updateUser: function(req, res) {
        let users = fileHelpers.getUsers();
        const userId = req.params.id;
        const userFromRequest = req.body;
        
        if(!validateUser(userFromRequest))
        {
            return res.status(400).json({"msg": "Bad request"});
        }
        if(typeof userId !== 'number')
        {
            return res.stauts(400).json({"msg": "Bad request"});
        }
        
        const userIndex = userId - 1;
        if(!(userIndex < users.length))
        {
            return res.stauts(404).json({"msg": "Bad request: User does not exists."});
        }
        const userToEdit = req.body;
        users[userIndex] = userToEdit;
        fileHelpers.guardarUsers(users, res);
        return res.status(200).json(users[userIndex]);
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