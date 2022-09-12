function dataValidation(req, res, next){
    const{title, price, description, gallery, stock, mostwanted, category} = req.body;
    
    if(title == undefined || price == undefined || gallery == undefined){
        return res.status(400).json({
            ok:false,
            msg:"los atributos precio titulo y galeria son obligatorios"
        })
    }

    if(title == "" || price == 0 || gallery.length == 0){
        return res.status(400).json({
            ok:false,
            msg:"los atributos precio titulo y galeria son obligatorios"
        })
    }

    next();
}

module.exports = dataValidation;