const fileHelpers = require('../../helpers/filesHelpers');

const productsController = {
    listar: (req, res, next)=>{
        let products = fileHelpers.getProducts(res);
        return res.status(200).json({
                    productos: products
                })
    },

    detalle: (req, res, next)=>{
        let products = fileHelpers.getProducts(res);
        const {id} = req.params;

        for(prod of products){
            if(prod.id == id){
                return res.status(200).json({
                    ok: true,
                    msg: "ok",
                    data: prod
                })
            }
        }

        return res.status(404).json({
            ok:false,
            msg: "Product not found"
        })
    },

    mostwanted: (req, res, next)=>{
        let products = fileHelpers.getProducts(res);
        let filteredProducts = products.filter((prod)=>{
            return prod.mostwanted == true;
        })

        return res.status(200).json({
                    filteredProducts
                })
    },

    crear: (req, res, next)=>{
        const{title, price, description, gallery, stock, mostwanted, category} = req.body;

        let products = fileHelpers.getProducts();
        products = fileHelpers.ordenarProductos(products);

        let newId = Number(products[products.length - 1].id) + 1;

        const newProduct = {
            id: newId,
            price: price,
            title: title,
            description : description == undefined? "" : description,
            gallery: gallery,
            stock: stock == undefined? 0 : stock,
            mostwanted : mostwanted == undefined? false : mostwanted,
            category : category
        }

        products.push(newProduct);

        fileHelpers.guardarProducts(products,res);

        return res.status(201).json({
            ok:true,
            msg:'creado correctamente',
            data: newProduct
        })

    },

    eliminar: (req, res, next)=>{
        const {id} = req.params;

        let products = fileHelpers.getProducts(res);
        products = products.filter((prod)=>{return prod.id != id});

        //FALTA ELIMINAR SUS IMAGENES DEL ARCHIVO DE PICTURES.JSON Y ELIMINAR DE LOS CARRITOS

        fileHelpers.guardarProducts(products ,res);

        return res.status(200).json({
            ok:true,
            msg:`Producto eliminado correctamente`
        })

    }
}

module.exports = productsController;