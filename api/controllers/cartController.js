const fs = require('fs');
const cartList = (req,res) => {
    const id = req.params.id;
    console.log(2)
    try {
        const usersToParse = fs.readFileSync('/Users/marcobonzini/Desktop/Bootcamp/Sprint1/Mi-ecommerce-4/api/data/user.json', 'utf-8');
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
        console.log(error);
    }
}

const cartEdit = (req,res,next) => {
    const id = req.params.id;
    const cartUpdate = req.body;

    try {
        const usersToParse = fs.readFileSync('/Users/marcobonzini/Desktop/Bootcamp/Sprint1/Mi-ecommerce-4/api/data/user.json', 'utf-8');
        const users = JSON.parse(usersToParse);
        const user = users.find(el => el.id === Number(id));
        console.log(user);
        const cart = user.cart;
        console.log(cart);
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
        
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    cartList, 
    cartEdit
};