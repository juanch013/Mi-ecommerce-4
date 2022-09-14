const fileHelpers = require('../../helpers/filesHelpers');

const productsController = {
    listar: (req, res, next)=>{
        let products = fileHelpers.getProducts(next);

        for(prod of products){
            prod.gallery = fileHelpers.getPicturesFromProduct(prod.id,res,next);
        }

        return res.status(200).json({
                    productos: products
                })
    },

    detalle: (req, res, next)=>{
        let products = fileHelpers.getProducts(next);
        const {id} = req.params;

        for(prod of products){
            if(prod.id == id){
                prod.gallery = fileHelpers.getPicturesFromProduct(prod.id,next);
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
        let products = fileHelpers.getProducts(next);
        let filteredProducts = products.filter((prod)=>{
            return prod.mostwanted == true;
        })

        for(prod of filteredProducts){
            prod.gallery = fileHelpers.getPicturesFromProduct(prod.id,next);
        }

        return res.status(200).json({
                    filteredProducts
                })
    },

    crear: (req, res, next)=>{
        const{title, price, description, gallery, stock, mostwanted, category} = req.body;

        const rol = req.newUsers.role;
        
        if(rol == "guest"){
            return res.status(401).json({
                ok: false,
                msg:'No tiene permisos suficientes'
            })
        }

        let products = fileHelpers.getProducts(next);
        products = fileHelpers.ordenarProductos(products);

        let newId = Number(products[products.length - 1].id) + 1;

        const newProduct = {
            id: newId,
            price: price,
            title: title,
            description : description == undefined? "" : description,
            gallery: [],
            stock: stock == undefined? 0 : stock,
            mostwanted : mostwanted == undefined? false : mostwanted,
            category : category
        }

        products.push(newProduct);

        fileHelpers.guardarProducts(products,next);

        return res.status(201).json({
            ok:true,
            msg:'creado correctamente',
            data: newProduct
        })

    },

    eliminar: (req, res, next)=>{
        const {id} = req.params;
        const rol = req.newUsers.role;
        
        if(rol == "guest"){
            return res.status(401).json({
                ok: false,
                msg:'No tiene permisos suficientes'
            })
        }

        if(id == undefined){
            return res.status(400).json({
                ok: false,
                msg:'Bad request'
            })
        }

        let products = fileHelpers.getProducts(next);

        if(!products.some((p)=>{ return p.id == id})){
            return res.status(404).json({
                ok:false,
                msg:"Product not found"
            })
        }


        
        //elimina las imagenes del product que se va a eliminar
        fileHelpers.eliminarPicturesDeProduct(id,next);
        

        //filtra os productos y guarda el array que no contiene el producto con producto.id == 'id'
        products = products.filter((prod)=>{return prod.id != id});
        fileHelpers.guardarProducts(products ,next);

        return res.status(200).json({
            ok:true,
            msg:`Producto eliminado correctamente`
        })

    },

    busqueda: (req, res, next)=>{
        let products = fileHelpers.getProducts(next);
        const q = req.query.q;

        if(q == undefined){
            return res.status(400).json({
                ok:false,
                msg:'Bad request'
            })
        }

        let productsFiltrados = [] 
        
        //aca recorro el array de productos y voy pusheando a 'productsFiltrados' los elementos
        //que contengan la keyword del query string
        products.forEach(element => {
            if(element.description.includes(q) || element.title.includes(q)){
                productsFiltrados.push(element);
            }
        });

        for(prod of productsFiltrados){
            prod.gallery = fileHelpers.getPicturesFromProduct(prod.id,next);
        }

        return res.status(200).json({
            ok:true,
            msg:'Busqueda exitosa',
            data: productsFiltrados
        })
    },

    modificar: (req, res, next)=>{
        const {id} = req.params;

        const rol = req.newUsers.role;
        
        if(rol == "guest"){
            return res.status(401).json({
                ok: false,
                msg:'No tiene permisos suficientes'
            })
        }

        const {title, description, price, gallery, category, mostwanted, stock} = req.body;
        let products = fileHelpers.getProducts();
        let prodModificado = {};

        for(prod of products){
            if(prod.id == id){
                prodModificado = prod;
                prod.title = title == undefined || title == "" ? prod.title : title;
                prod.description = description == undefined || description == "" ? prod.description : description;
                prod.price = price == undefined? prod.price : price;
                prod.stock = stock == undefined? prod.stock : stock;
                prod.mostwanted = mostwanted == undefined? prod.mostwanted : mostwanted;
                prod.category = category == undefined? prod.undefined : undefined;
                prod.gallery = gallery == undefined? prod.gallery : gallery;

                break;
            }
        }

        return res.status(200).json({
            ok:true,
            msg:`Se modifico exitosamente el producto Nro${id}`,
            data:prod
        })
    }

}

module.exports = productsController;