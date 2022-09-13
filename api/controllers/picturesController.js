const fs = require('fs');


const getPictures = (req, res, next) => {
	// /pictures?product=id
	// Acción: Recupera la lista de pictures del product identificado con id. Responde con un array conteniendo las pictures.
	// POR QUERY VIENEN COMO STRING!
	try {
		const productId = req.query.product;

		if (!productId) {
			return res.status(400).json({ error: 'Id is required', message: '' });
		}

		if (isNaN(productId)) {
			return res
				.status(400)
				.json({ error: 'Id must be a number', message: '' });
		}

		const dbPictures = fs.readFileSync(
			__dirname + '/../data/pictures.json',
			'utf-8'
		);
		const pictures = JSON.parse(dbPictures);

		const picturesProduct = pictures?.filter(
			(picture) => picture.product_id === parseInt(productId)
		);

		if (!picturesProduct.length) {
			return res
				.status(404)
				.json({ error: 'The product does not have images', message: '' });
		}

		res.status(200).json(picturesProduct);
	} catch (error) {
		next(error);
	}
};

const getPicture = (req, res, next) => {
	// GET /pictures/:id
	// Acción: Recupera la picture con el id solicitado. Responde con la información completa de la picture con el id buscado.
	try {
		const pictureId = req.params.id;

		if (!pictureId) {
			return res.status(400).json({ error: 'Id is required', message: '' });
		}

		if (isNaN(pictureId)) {
			return res
				.status(400)
				.json({ error: 'Id must be a number', message: '' });
		}

		const dbPictures = fs.readFileSync(
			__dirname + '/../data/pictures.json',
			'utf-8'
		);
		const pictures = JSON.parse(dbPictures);

		const picture = pictures?.find(
			(picture) => picture.id === parseInt(pictureId)
		);

		if (!picture) {
			return res.status(404).json({ error: 'Picture not found', message: '' });
		}

		res.status(200).json(picture);
	} catch (error) {
		next(error);
	}
};

const createPicture = (req, res, next) => {
	// POST /pictures
	//Acción: Crea una nueva picture. Debe recibir un body con la info de la picture a crear. Responde con la info completa de la nueva picture.
	// Response codes:
	// 201 Created.
	// 400 Bad Request (si la llamada es incorrecta)
	// 500 Server Error.
	try {
		const { pictureUrl, pictureDescription, productId } = req.body;

		if (!pictureUrl || !pictureDescription || !productId) {
			return res.status(400).json({ error: 'Missing data', message: '' });
		}

		if (isNaN(productId)) {
			return res
				.status(400)
				.json({ error: 'Id must be a number', message: '' });
		}

		const dbproducts = fs.readFileSync(
			__dirname + '/../data/products.json',
			'utf-8'
		);
		const products = JSON.parse(dbproducts);

		const product = products.find(
			(product) => product.id === parseInt(productId)
		);
		if (!product) {
			return res.status(404).json({ error: 'Product not found', message: '' });
		}

		const dbPictures = fs.readFileSync(
			__dirname + '/../data/pictures.json',
			'utf-8'
		);
		const pictures = JSON.parse(dbPictures);

		const pictureId = pictures.at(-1).id + 1;

		const newPicture = {
			id: pictureId,
			url: pictureUrl,
			description: pictureDescription,
			productId,
		};

		pictures.push(newPicture);

		fs.writeFileSync(
			__dirname + '/../data/pictures.json',
			JSON.stringify(pictures)
		);

		res.status(201).json(newPicture);
	} catch (error) {
		next(error);
	}
};

const updatePicture = (req, res, next) => {
	// PUT /pictures/:id
	//   Acción: Actualiza la picture identificada con id. Debe recibir un body con la info de la picture a modificar.
	// Responde con la info completa de la picture modificada.
	try {
		const { pictureUrl, pictureDescription } = req.body;
		const pictureId = req.params.id;

		if (!pictureUrl || !pictureDescription || !pictureId) {
			return res.status(400).json({ error: 'Missing data', message: '' });
		}

		if (isNaN(pictureId)) {
			return res
				.status(400)
				.json({ error: 'Id must be a number', message: '' });
		}

		const dbPictures = fs.readFileSync(
			__dirname + '/../data/pictures.json',
			'utf-8'
		);
		const pictures = JSON.parse(dbPictures);

		const picture = pictures.find(
			(picture) => picture.id === parseInt(pictureId)
		);

		if (!picture) {
			return res.status(404).json({ error: 'Picture not found', message: '' });
		}

		picture.url = pictureUrl;
		picture.description = pictureDescription;

		fs.writeFileSync(
			__dirname + '/../data/pictures.json',
			JSON.stringify(pictures)
		);

		res.status(200).json(picture);
	} catch (error) {
		next(error);
	}
};

const deletePicture = (req, res, next) => {
  // DELETE /pictures/:id
  // Acción: Eliminar la picture identificada con id. Responde con información sobre la eliminación realizada.
  try {
    const pictureId = req.params.id;

    if (!pictureId) {
      return res.status(400).json({ error: 'Id is required', message: '' });
    }

    if (isNaN(pictureId)) {
      return res
        .status(400)
        .json({ error: 'Id must be a number', message: '' });
    }

    const dbPictures = fs.readFileSync(
      __dirname + '/../data/pictures.json',
      'utf-8'
    );
    const pictures = JSON.parse(dbPictures);

    const picture = pictures.find(
      (picture) => picture.id === parseInt(pictureId)
    );

    if (!picture) {
      return res.status(404).json({ error: 'Picture not found', message: '' });
    }

    const index = pictures.indexOf(picture);
    pictures.splice(index, 1);  

    fs.writeFileSync(
      __dirname + '/../data/pictures.json',
      JSON.stringify(pictures)
    );

    res.status(200).json({ message: 'Picture deleted' });
  } catch (error) {
    next(error);
  }
};


module.exports = { getPictures, getPicture, createPicture, updatePicture, deletePicture };

/// ######################################################################## FUNCIONES ANTERIORES
//viejas
// const getPicture = (req, res, next) => {
// 	try {
// 		const { id } = req.params;

// 		if (isNaN(id)) {
// 			return res
// 				.status(400)
// 				.json({ error: 'Id must be a number', message: '' });
// 		}

// 		const dbproducts = fs.readFileSync(
// 			__dirname + '/../data/products.json',
// 			'utf-8'
// 		);
// 		const products = JSON.parse(dbproducts);

// 		const gallery = products.map((product) => product.gallery);
// 		const flattenGallery = gallery.flat(1);
// 		// Se quitan duplicados
// 		const uniqueGallery = [...new Set(flattenGallery)];
// 		const picture = uniqueGallery.find(
// 			(picture) => picture['picture-id'] === parseInt(id)
// 		);

// 		if (!picture) {
// 			return res.status(404).json({ error: 'Picture not found', message: '' });
// 		}

// 		res.status(200).json(picture);
// 	} catch (error) {
// 		next(error);
// 	}
// };

// const getPictures = (req, res, next) => {
// 	try {
// 		const { producto } = req.query;

// 		if (!producto) {
// 			return res.status(400).json({ error: 'Id is required', message: '' });
// 		}
// 		console.log(typeof producto);

// 		// si id no es un numero
// 		if (isNaN(producto)) {
// 			return res
// 				.status(400)
// 				.json({ error: 'Id must be a number', message: '' });
// 		}

// 		const dbproducts = fs.readFileSync(
// 			__dirname + '/../data/products.json',
// 			'utf-8'
// 		);
// 		const products = JSON.parse(dbproducts);
// 		const product = products.find(
// 			(product) => product.id === parseInt(producto)
// 		);

// 		if (!product) {
// 			return res.status(404).json({ error: 'Product not found', message: '' });
// 		}

// 		res.status(200).json(product.gallery);
// 	} catch (error) {
// 		next(error);
// 	}
// };
