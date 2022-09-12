const fs = require('fs');
const productsToParse = fs.readFileSync('../data/productos', 'utf-8');

const cartList = (req,res,next) => {
    const id = req.params.id;
    try {
        const usersToParse = fs.readFileSync('../data/user', 'utf-8');
        const users = JSON.parse(usersToParse);
        const user = users.find(el => el.id === Number(id));
        if(!user){
            return res.stauts(404).json({
                msg: 'Id de usuario no encontrado'
            })
        }
        const cart = user.cart;
        if(cart.lenght == 0){
            res.status(200).json({
                msg: 'El carrito de ' + user.name + ' esta vacio'
            })
        }
        res.status(200).json({
            msg: 'Carrito del usuario ' + user.username,
            cart
        })

    } catch (error) {
        next();
    }
}

/* const cartEdit = (req,res,next) => {
    const id = req.params.id;
    const 
} */