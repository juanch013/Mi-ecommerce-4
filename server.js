require('dotenv').config();
const express = require('express');
//Swagger
const swaggerUi = require('swagger-ui-express');
// const YAML = require('yamljs');
// const swaggerDocument = YAML.load('./swagger.yaml');
//Middleware
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

//Middlewares
const {logErrors,clientErrorHandler} = require('./api/middlewares/errorHandler');

//Routes
const productRoutes = require('./api/routes/productsRoutes')

const app = express();
const PORT = 3000;

app.use(express.json());

// app.use('/login', usersRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(logErrors);
app.use(clientErrorHandler);

app.use('/api/v1/products',productRoutes);


app.listen(PORT, () => {
	console.log(`Servidor corriendo en el puerto ${PORT}`);
});
