const fs = require('fs');

// let pictures = [
//   {
//     "id": 1,
//     "url": "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",
//     "description": "Google Logo",
//     "product_id": 1
//   },
//   {
//     "id": 2,
//     "url": "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",
//     "description": "Google Logo",
//     "product_id": 4
//   },
//   {
//     "id": 3,
//     "url": "http://dummyimage.com/231x100.png/dddddd/000000",
//     "description": "Google Logo",
//     "product_id": 7
//   },
//   {
//     "id": 4,
//     "url": "http://dummyimage.com/159x100.png/5fa2dd/ffffff",
//     "description": "Sin descripcion",
//     "product_id": 2
//   },
//   {
//     "id": 5,
//     "url": "http://dummyimage.com/105x100.png/dddddd/000000",
//     "description": "Sin descripcion",
//     "product_id": 5
//   },
//   {
//     "id": 6,
//     "url": "http://dummyimage.com/236x100.png/5fa2dd/ffffff",
//     "description": "Sin descripcion",
//     "product_id": 8
//   },
//   {
//     "id": 7,
//     "url": "http://dummyimage.com/194x100.png/dddddd/000000",
//     "description": "Sin descripcion",
//     "product_id": 5
//   },
//   {
//     "id": 8,
//     "url": "http://dummyimage.com/220x100.png/ff4444/ffffff",
//     "description": "Sin descripcion",
//     "product_id": 8
//   },
//   {
//     "id": 9,
//     "url": "http://dummyimage.com/241x100.png/dddddd/000000",
//     "description": "Sin descripcion",
//     "product_id": 1
//   },
//   {
//     "id": 10,
//     "url": "http://dummyimage.com/158x100.png/ff4444/ffffff",
//     "description": "Sin descripcion",
//     "product_id": 3
//   },
//   {
//     "id": 11,
//     "url": "http://dummyimage.com/158x100.png/ff4444/ffffff",
//     "description": "Sin descripcion",
//     "product_id": 6
//   },
// ]

// let products = [
// 	{
// 		"id": 1,
// 		"title": "Producto 1",
// 		"price": "$739.14",
// 		"description": "Extirpation of Matter from Lower Esophagus, Via Opening",
// 		"gallery": [
// 			{
// 				"picture-id": 1,
// 			}
// 		],
// 		"category": "",
// 		"mostwanted": true,
// 		"stock": 1
// 	},
// 	{
// 		"id": 2,
// 		"title": "Producto 2",
// 		"price": "$775.90",
// 		"description": "Introduction of Other Antineoplastic into POC, Endo",
// 		"gallery": [
// 			{
// 				"picture-id": 19,
// 			}
// 		],
// 		"category": "",
// 		"mostwanted": true,
// 		"stock": 2
// 	},
// 	{
// 		"id": 3,
// 		"title": "Producto 3",
// 		"price": "$420.32",
// 		"description": "Supplement Rectum with Nonaut Sub, Via Opening",
// 		"gallery": [
// 			{
// 				"picture-id": 6,
// 			}
// 		],
// 		"category": "",
// 		"mostwanted": true,
// 		"stock": 3
// 	}
// ]

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

    console.log(picturesProduct)

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
	//POR AHORA NO HACE NADA
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

module.exports = { getPictures, getPicture, createPicture };

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
