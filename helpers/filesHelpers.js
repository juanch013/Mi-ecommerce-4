const fs = require('fs');

//retorna un array de objetos literales con los productos del sistema
const getProducts = (res)=>{
    try {
        let productsToParse = fs.readFileSync('./api/data/products.json');
        return JSON.parse(productsToParse);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok:false,
            msg:"Server Error"
        })
    }
}

//retorna un array de objetos literales con los usuarios del sistema
const getUsers = (res)=>{
    try {
        let usersToParse = fs.readFileSync('./api/data/user.json');
        return JSON.parse(usersToParse);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok:false,
            msg:"Server Error"
        })

    }
}

//recibe un array de objetos literales con todos los usuarios del sistema, los transforma a un
//string en formato json y los guarda en el archivo users.json
const guardarUsers = (arr, res)=>{
    try {
        fs.writeFileSync('./api/data/user.json',JSON.stringify(arr));
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok:false,
            msg:"Server Error"
        })
    }
}

//recibe un array de objetos literales con todos los productos del sistema, los transforma a un
//string en formato json y los guarda en el archivo products.json
const guardarProducts = (arr,res)=>{
    try {
        fs.writeFileSync('./api/data/products.json',JSON.stringify(arr));
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok:false,
            msg:"Server Error"
        })
    }
}

//recibe un array de objetos literales y lo ordena en orden ascendente segun su id
const ordenarProductos= (arr)=>{
    arr.sort((a,b)=>{
        return Number(a.id) - Number(b.id)
    })

    return arr;
}

module.exports = {getProducts,getUsers,guardarProducts,guardarUsers,ordenarProductos};