const bcrypt = require('bcrypt');
const fileHelpers = require('../../helpers/filesHelpers');
const {generateJWT} = require('../../helpers/generateJWT');


// Validates only suported user information is accepted and they're the right data type
// const validateUserFields = (userObject) => {
//     let foundInvalidField = false;
//     Object.keys(userObject).forEach((key) => {
//         const validFields = ["email", "username", "password", "firstname", "lastname", "profilepic", "role", "cart"];
//         if(!validFields.includes(key)){foundInvalidField = true;}
//     });

//     const {email, username, password, firstname, lastname, profilepic, role, cart} = userObject;
//     return (!foundInvalidField &&
//             typeof email === 'string' && 
//             typeof username === 'string' && 
//             typeof password === 'string' &&
//             typeof firstname === 'string' && 
//             typeof lastname === 'string' &&
//             typeof role === 'string' &&
//             typeof cart === 'object' &&
//             (typeof profilepic === 'string' || typeof profilepic === 'undefined'))
// }

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

// Filters out password field from user object so it's not returned
const getUserWithoutPassword = (user) => {
    const {id, email, username, firstname, lastname, role, profilepic, cart} = user;
    return {id, email, username, firstname, lastname, role, profilepic, cart};
}

const usersController = {
    listUsers: function(req, res, next) {
        const users = fileHelpers.getUsers(next);
        const usersWithoutPassword = users.map((user) => {
             return getUserWithoutPassword(user);
        })
        res.status(200).send({
            error: false,
            msg:"Listado de usuarios",
            data: usersWithoutPassword});
    }, 

    getUser: function(req, res, next) {
        const users = fileHelpers.getUsers(next);
        const userId = Number(req.params.id);

        if(Number(userId) < 0){
            return res.status(400).json({
                error: true,
                msg: "Bad request: User id must be a number"});
        }

        if(isNaN(userId)) {return res.status(400).json({
            error: true,
            msg: "Bad request: User id must be a number"});}

        //Searches for userIndex. If userIndex === -1 means user wasn't found.
        const userIndex = findUserById(users, userId);
        if(userIndex < 0) {return res.status(404).json({
            error: true,
            msg: "User does not exists."})}

        const userWithoutPassword = getUserWithoutPassword(users[userIndex])
        return res.status(200).json({
            error: false,
            msg:"Detalle de usuario",
            data:userWithoutPassword});

    },

    createUser: function(req, res, next) {
        const userFromRequest = req.body;
        const users = fileHelpers.getUsers(next);

        // if(!validateUserFields(userFromRequest)) {return res.status(400).json({
        //     error: true,
        //     msg: "Bad request"})}

        // Si usuario ya existe en la base de datos no se puede crear
        const userExists = users.find((u) => u.username === userFromRequest.username);
        if(userExists) {return res.status(400).json({error:true, msg: "User already exists."});}

        // Se hashea la contrase??a
        const hash = bcrypt.hashSync(userFromRequest.password, 10);

        // Se guarda la contrasena hasheada en el objeto
        userFromRequest.password = hash;

        // Se accede al id del ultimo usuario y se le suma 1
        const id = users.at(-1).id + 1;
        const userToAdd = {id, ...userFromRequest};
        users.push(userToAdd);

        fileHelpers.guardarUsers(users, next);
        return res.status(201).json({error:false , msg: "Usuario creado correctamente", data:getUserWithoutPassword(userToAdd)});
    },

    login: async function(req, res, next) {
        const {username,password} = req.body;

        let users = fileHelpers.getUsers(next);
        let usuarioFind = users.find(u => u.username == username);

        let passwordMatch = null;
        if (usuarioFind) {
          // Se compara la contrase??a hasheada con la contrase??a ingresada por el usuario
          passwordMatch = await bcrypt.compare(password, usuarioFind.password);
        }

        // Si el usuario no existe o la contrase??a no coincide se envia un mensaje de error
        if(!usuarioFind || !passwordMatch){
           return res.status(401).json({
              error:true,
              msg:'las credenciales no son correctas'
           })
        }

        const userFoundWithoutPassword = getUserWithoutPassword(usuarioFind);

        let payload = {
              ...userFoundWithoutPassword
           }  
     
        const token = await generateJWT(payload);

        return res.status(200).json({
            error:false,
            msg:"authorized",
            data:{
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

        // if(isNaN(userId)) {return res.status(400).json({error: true, msg: "Bad request: User id must be a number"})}

        //Searches for userIndex. If userIndex === -1 means user wasn't found.
        const userIndex = findUserById(users, userId);
        if(userIndex < 0)
        {
            return res.status(404).json({error: true, msg: "User does not exists."})
        }
        //Validates data
        // if(!validateUserFields(userFromRequest)) {return res.status(400).json({error: true, msg: "Bad request"});}

        // Se hashea la contrase??a
        userFromRequest.password = bcrypt.hashSync(userFromRequest.password, 10);
        
        users[userIndex] = {id: userId, ...userFromRequest};
        fileHelpers.guardarUsers(users, next);
        return res.status(200).json({error: false, msg:"Usuario actualizado",data:getUserWithoutPassword(userFromRequest)});
    },

    deleteUser: function(req, res,next) {
        let users = fileHelpers.getUsers(next);
        const userId = Number(req.params.id);

        // if(isNaN(userId)) {return res.status(400).json({error:true , msg: "Bad request: User id must be a number"});}

        //Searches for userIndex. If userIndex === -1 means user wasn't found.
        const userIndex = findUserById(users, userId);
        if(userIndex < 0) {return res.status(404).json({error: true, msg: "User does not exists."});}

        //Shifts elements back from element to delete to end and pops last element
        const userToDelete = users[userIndex];
        for(let i = userIndex; i < users.length - 1; i++)
        {
            users[i] = users[i + 1];
        }
        users.pop();

        fileHelpers.guardarUsers(users, next);
        return res.status(200).json({error: false, msg:"usuario borrado correctamente",data: getUserWithoutPassword(userToDelete)});
    }
}

module.exports = usersController;
