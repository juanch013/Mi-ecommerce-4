const fs = require('fs');
const {
	getProducts,
	getImages,
	guardarPictures,
} = require('../../helpers/filesHelpers');

// /pictures?product=id
// Acción: Recupera la lista de pictures del product identificado con id. Responde con un array conteniendo las pictures.
// Response codes:
// 200 OK.
// 404 Not Found (si no existe el product con el id solicitado)
// 500 Server Error.
// POR QUERY VIENEN COMO STRING!
const getPictures = (req, res, next) => {
	try {
		const productId = req.query.product;

		console.log(typeof req.newUsers.role);
		if (
			req.newUsers.role !== 'admin' &&
			req.newUsers.role !== 'guest' &&
			req.newUsers.role !== 'god'
		) {
			return res.status(401).json({ 
				message: 'You are not authorized to access this resource',
			});
		}

		if (!productId) {
			return res.status(400).json({ error: 'Id is required', message: '' });
		}

		if (isNaN(productId)) {
			return res
				.status(400)
				.json({ error: 'Id must be a number', message: '' });
		}

		const products = getProducts(res, next);

		const productExists = products.find(
			(product) => product.id === parseInt(productId)
		);
		if (!productExists) {
			return res.status(404).json({ error: 'Product not found', message: '' });
		}

		// Se lee el arhivo de pictures
		const pictures = getImages(res, next);

		console.log(pictures);
		const picturesProduct = pictures?.filter(
			(picture) => picture.productId === parseInt(productId)
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

// GET /pictures/:id
// Acción: Recupera la picture con el id solicitado. Responde con la información completa de la picture con el id buscado.
// Response codes:
// 200 OK.
// 404 Not Found (si no existe la picture con el id solicitado)
// 500 Server Error.
const getPicture = (req, res, next) => {
	try {
		const pictureId = req.params.id;

		if (
			req.newUsers.role !== 'admin' &&
			req.newUsers.role !== 'guest' &&
			req.newUsers.role !== 'god'
		) {
			return res.status(401).json({
				message: 'You are not authorized to access this resource',
			});
		}

		if (!pictureId) {
			return res.status(400).json({ error: 'Id is required', message: '' });
		}

		if (isNaN(pictureId)) {
			return res
				.status(400)
				.json({ error: 'Id must be a number', message: '' });
		}

		const pictures = getImages(res, next);

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

// POST /pictures
// Acción: Crea una nueva picture. Debe recibir un body con la info de la picture a crear.
// Responde con la info completa de la nueva picture.
// Response codes:
// 201 Created.
// 400 Bad Request (si la llamada es incorrecta)
// 500 Server Error.
const createPicture = (req, res, next) => {
	try {
		const { pictureUrl, pictureDescription, productId } = req.body;

		if (req.newUsers.role !== 'admin' && req.newUsers.role !== 'god') {
			return res.status(401).json({
				message: 'You are not authorized to access this resource',
			});
		}

		if (!pictureUrl || !pictureDescription || !productId) {
			return res.status(400).json({ error: 'Missing data', message: '' });
		}

		if (isNaN(productId)) {
			return res
				.status(400)
				.json({ error: 'Id must be a number', message: '' });
		}

		// Se traen los productos del archivo
		const products = getProducts(res);

		const product = products.find(
			(product) => product.id === parseInt(productId)
		);

		if (!product) {
			return res.status(404).json({ error: 'Product not found', message: '' });
		}

		// Se traen las pictures del archivo
		const pictures = getImages(res, next);

		// Se calcula el id de la nueva picture
		const pictureId = pictures.at(-1).id + 1;

		const newPicture = {
			id: pictureId,
			url: pictureUrl,
			description: pictureDescription,
			productId,
		};

		pictures.push(newPicture);

		// Se escribe en el archivo la nueva picture
		guardarPictures(pictures, next);

		res.status(201).json(newPicture);
	} catch (error) {
		next(error);
	}
};

// PUT /pictures/:id
// Acción: Actualiza la picture identificada con id. Debe recibir un body con la info de la picture a modificar.
// Responde con la info completa de la picture modificada.
// Response codes:
// 200 OK.
// 400 Bad Request (si la llamada es incorrecta)
// 404 Not Found (si no existe la picture con el id solicitado)
// 500 Server Error.
const updatePicture = (req, res, next) => {
	try {
		const { pictureUrl, pictureDescription } = req.body;
		const pictureId = req.params.id;

		if (req.newUsers.role !== 'admin' && req.newUsers.role !== 'god') {
			return res.status(401).json({
				message: 'You are not authorized to access this resource',
			});
		}

		if (!pictureUrl || !pictureDescription || !pictureId) {
			return res.status(400).json({ error: 'Missing data', message: '' });
		}

		if (isNaN(pictureId)) {
			return res
				.status(400)
				.json({ error: 'Id must be a number', message: '' });
		}

		const pictures = getImages(res, next);

		const picture = pictures.find(
			(picture) => picture.id === parseInt(pictureId)
		);

		if (!picture) {
			return res.status(404).json({ error: 'Picture not found', message: '' });
		}

		picture.url = pictureUrl;
		picture.description = pictureDescription;

		// Se escribe en el archivo la nueva picture
		guardarPictures(pictures, next);

		res.status(200).json(picture);
	} catch (error) {
		next(error);
	}
};

// DELETE /pictures/:id
// Acción: Eliminar la picture identificada con id. Responde con información sobre la eliminación realizada.
// Response codes:
// 200 OK.
// 404 Not Found (si no existe la picture con el id solicitado)
// 500 Server Error.
const deletePicture = (req, res, next) => {
	try {
		const pictureId = req.params.id;

		if (req.newUsers.role !== 'admin' && req.newUsers.role !== 'god') {
			return res.status(401).json({
				auth: false,
				message: 'You are not authorized to access this resource',
			});
		}

		if (!pictureId) {
			return res.status(400).json({ error: 'Id is required', message: '' });
		}

		if (isNaN(pictureId)) {
			return res
				.status(400)
				.json({ error: 'Id must be a number', message: '' });
		}

		const pictures = getImages(res, next);

		const picture = pictures.find(
			(picture) => picture.id === parseInt(pictureId)
		);

		if (!picture) {
			return res.status(404).json({ error: 'Picture not found', message: '' });
		}

		const index = pictures.indexOf(picture);
		pictures.splice(index, 1);

		// Se borra la picture del archivo
		guardarPictures(pictures, next);

		res.status(200).json({ message: 'Picture deleted', picture: picture });
	} catch (error) {
		next(error);
	}
};

module.exports = {
	getPictures,
	getPicture,
	createPicture,
	updatePicture,
	deletePicture,
};
