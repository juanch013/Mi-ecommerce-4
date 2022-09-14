const bcrypt = require('bcrypt');
const fileHelpers = require('../../helpers/filesHelpers');
const {generateJWT} = require('../../helpers/generateJWT');

const validateUserFields = (userObject) => {
    const {email, username, password, firstname, lastname, profilepic, role} = userObject;
    return (typeof email === 'string' && 
            typeof username === 'string' && 
            typeof password === 'string' &&
            typeof firstname === 'string' && 
            typeof lastname === 'string' &&
            typeof role === 'string' &&
            (typeof profilepic === 'string' || typeof profilepic === 'undefined'))
}

//Recibe array de usuarios y un id de usuario. 
//Retorna el indice del usuario en el array de usuarios cuyo id coincide con el parametro id recibido.
const findUserById = (users, id) => {
    let userIndex = -1;
    users.forEach((user, index) => {
        if(user.id === id)
        {
            userIndex = index;
        }
    })
    return userIndex;

}

const usersController = {
    listUsers: function(req, res, next) {
        const users = fileHelpers.getUsers(next);
        res.status(200).send(users);
    }, 

    getUser: function(req, res, next) {
        const users = fileHelpers.getUsers(next);
        const userId = Number(req.params.id);

        const userIndex = findUserById(users, userId);
        if(userIndex < 0)
        {
            return res.status(404).json({"msg": "User does not exists."})
        }
        return res.status(200).json(users[userIndex]);

    },

    createUser: function(req, res, next) {
        const userFromRequest = req.body;
        if(!validateUserFields(userFromRequest))
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
                idUser: usuarioFind.id,
                username: usuarioFind.username
            },
            token: token
        })

    },

    updateUser: function(req, res, next) {
        let users = fileHelpers.getUsers(next);
        const userFromRequest = req.body;
        const userId = Number(req.params.id);

        const userIndex = findUserById(users, userId);

        if(userIndex < 0)
        {
            return res.status(404).json({"msg": "User does not exists."})
        }
        
        if(!validateUserFields(userFromRequest))
        {
            return res.status(400).json({"msg": "Bad request"});
        }
        // Se hashea la contraseña
        userFromRequest.password = bcrypt.hashSync(userFromRequest.password, 10);
        
        users[userIndex] = {userId, ...userFromRequest};
        fileHelpers.guardarUsers(users, next);
        return res.status(200).json(userFromRequest);
    },

    deleteUser: function(req, res,next) {
        let users = fileHelpers.getUsers(next);
        const userId = Number(req.params.id);

        const userIndex = findUserById(users, userId);
        console.log(userId, " ", userIndex);
        if(userIndex < 0)
        {
            return res.status(404).json({"msg": "User does not exists."});
        }
        const userToDelete = users[userIndex];
        for(let i = userIndex; i < users.length - 1; i++)
        {
            users[i] = users[i + 1];
        }
        users.pop();
        fileHelpers.guardarUsers(users, next);
        return res.status(200).json(userToDelete);
    }
}

module.exports = usersController;
