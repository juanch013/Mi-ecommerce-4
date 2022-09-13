const filesHandler = require('../../helpers/filesHelpers');

//req.newuser

const cartList = (req,res, next) => {
    const id = req.params.id;
    //if(req.newUser.id == id || req.newUser.role == 'god' || req.newUser.role == 'admin'){
        try {
            const users = filesHandler.getUsers(res, next);
            const user = users.find(el => el.id === Number(id));
            if(!user){
                res.status(404).json({
                    msg: 'Id de usuario no encontrado.'
                })
            }
            const cart = user.cart;
            if(cart.length == 0){
                res.status(200).json({
                    msg: 'El carrito del usuario ' + user.username + ' esta vacio.'
                })
            }
            res.status(200).json({
                msg: 'Carrito del usuario ' + user.username,
                cart
            })

        } catch (error) {
            console.log(error);
        }
    // }else{
    //     res.status(500).json({
    //         msg: 'No tienes los permisos para efectuar esta accion'
    //     })
    // }

}

const cartEdit = (req,res,next) => {
    const id = req.params.id;
    const cartUpdate = req.body;
    console.log(cartUpdate.length);
    if(cartUpdate.length > 0){
   
    //if(req.newUser.id == id || req.newUser.role == 'god'){
        try {
            const users = filesHandler.getUsers(res, next);
            const user = users.find(el => el.id === Number(id));            
            if(!user){
                res.status(404).json({
                    msg: 'Id de usuario no encontrado.'
                })
            }
            
            const cart = user.cart;
            cartUpdate.forEach(element => {
            const aux = cart.find(el => el.id == element.id);
            if(!aux){
                cart.push(element);
            }else{
                aux.quantity += element.quantity;
            }
            });
            res.status(200).json({
                msg: 'Carrito actualizado:',
                cart
            })
            filesHandler.guardarUsers(users,res);
            
        } catch (error) {
            next();
        }
    // }else{
    //     res.status(500).json({
    //         msg: 'No tienes los permisos para efectuar esta accion'
    //     })
    //} 
     }else{
        res.status(500).json({
            msg: 'Debe ingresar al menos un producto'
        })
    }

}

module.exports = {
    cartList, 
    cartEdit
};