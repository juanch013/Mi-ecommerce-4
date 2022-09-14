const bcrypt = require('bcrypt');
const fileHelpers = require('../../helpers/filesHelpers');
const {generateJWT} = require('../../helpers/generateJWT');

const validateUserFilds = (userObject) => {
    const {email, username, password, firstname, lastname, profilepic, role} = userObject;
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
    listUsers: function(req, res, next) {
        const users = fileHelpers.getUsers(next);
        res.status(200).send(users);
    }, 

    getUser: function(req, res,next) {
        const users = fileHelpers.getUsers(next);
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

    createUser: function(req, res, next) {
        const userFromRequest = req.body;
        if(!validateUserFilds(userFromRequest))
        {
          return res.status(400).json({"msg": "Bad request"})
        }
        // Si usuario ya existe en la base de datos no se puede crear
        const users = fileHelpers.getUsers(next);
        const userExists = users.find((u) => u.username === userFromRequest.username);
        if(userExists)
        {
            return res.status(400).json({"msg": "User already exists."});
        }
        // Se hashea la contraseña
        const hash = bcrypt.hashSync(userFromRequest.password, 10);
        // Se guarda la contrasena hasheada en el objeto
        userFromRequest.password = hash;
        // Se accede al id del ultimo usuario y se le suma 1
        const id = users.at(-1).id + 1;
        const userToAdd = {id, ...userFromRequest};
        users.push(userToAdd);
        fileHelpers.guardarUsers(users, next);
        return res.status(201).json(userToAdd);
    },

    login: async function(req, res, next) {
        const {username,password} = req.body;

        let users = fileHelpers.getUsers(next);
        let usuarioFind = users.find(u => u.username == username);

        let passwordMatch = null
        if (usuarioFind) {
          // Se compara la contraseña hasheada con la contraseña ingresada por el usuario
          passwordMatch = await bcrypt.compare(password, usuarioFind.password);
        }

        // Si el usuario no existe o la contraseña no coincide se envia un mensaje de error
        if(!usuarioFind || !passwordMatch){
           return res.status(401).json({
              ok:false,
              message:'las credenciales no son correctas'
           })
        }

        let payload = {
              ...usuarioFind
           }  
     
        const token = await generateJWT(payload);

        return res.status(200).json({
            success:true,
            message:"authorized",
            user:{
                idUser:usuarioFind.id,
                username: usuarioFind.username
            },
            token: token
        })

    },

    updateUser: function(req, res,next) {
        let users = fileHelpers.getUsers(next);
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
        fileHelpers.guardarUsers(users, next);
        return res.status(200).json(users[userIndex]);
    },

    deleteUser: function(req, res,next) {
        
    },
}
