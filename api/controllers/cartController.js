const filesHandler = require('../../helpers/filesHelpers');
const cartList = (req,res, next) => {
const id = req.params.id;
if(isNaN(id)){
    return res.status(500).json({
        msj: 'El parametro id debe ser un numero'
    })
}
const role= req.newUsers.role;
    if(req.newUsers.id === Number(id) || role === 'god' || role === 'admin'){
        try {
            const users = filesHandler.getUsers(next);
            const user = users.find(el => el.id === Number(id));
            if(!user){
                return res.status(404).json({
                    msg: 'Id de usuario no encontrado.'
                })
            }
            const cart = user.cart;
            if(cart.length == 0){
                return res.status(200).json({
                    msg: 'El carrito del usuario ' + user.username + ' esta vacio.'
                })
            }
            return res.status(200).json({
                msg: 'Carrito del usuario ' + user.username,
                cart
            })

        } catch (error) {
            next(error);
        }
    } else{
        return res.status(500).json({
            msg: 'No tienes los permisos para efectuar esta accion'
        })
    }

} 

const cartEdit = (req,res,next) => {
    const id = req.params.id;
    if(isNaN(id)){
        return res.status(500).json({
            msj: 'El parametro id debe ser un numero'
        })
    }
    const cartUpdate = req.body;
    const role= req.newUsers.role;
    if(cartUpdate.length > 0){  
        if(req.newUsers.id === Number(id) || role === 'god'){
            try {
                const users = filesHandler.getUsers(next);
                const user = users.find(el => el.id === Number(id));            
                if(!user){
                    return res.status(404).json({
                        msg: 'Id de usuario no encontrado.'
                    })
                }
                const cart = user.cart;
                cartUpdate.forEach(element => {
                    if(!element.id || !element.quantity || isNaN(element.id) || isNaN(element.quantity)){
                        filesHandler.guardarUsers(users,res);
                        return res.status(400).json({
                            msg: 'Error: Cada producto debe tener id, quantity y ambos deben ser numeros.',
                            cart
                        })
                    }
                    const aux = cart.find(el => el.id == element.id);
                    if(!aux){
                        cart.push(element);
                    }else{
                        aux.quantity += Number(element.quantity);
                    }
                    });
                    filesHandler.guardarUsers(users,next);
                    return res.status(200).json({
                        msg: 'Carrito actualizado:',
                        cart
                    })
            } catch (error) {
                next(error);
            }
        }else{
            return res.status(403).json({
                msg: 'No tienes los permisos para efectuar esta accion'
            })
            } 
    }else{
        return res.status(400).json({
            msg: 'Debe ingresar al menos un producto'
        })
    }

}

module.exports = {
    cartList, 
    cartEdit
};