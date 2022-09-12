require('dotenv').config();
const express = require('express');

//Swagger
const swaggerUi = require('swagger-ui-express');
// const YAML = require('yamljs');
// const swaggerDocument = YAML.load('./swagger.yaml');
//Middleware
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

// Se importa el archivo de rutas de pictures
const picturesRoutes = require('./api/routes/picturesRoutes');

//Middlewares
const {logErrors,clientErrorHandler} = require('./api/middlewares/errorHandler');

const app = express();
const PORT = 3000;
app.use(express.json());


app.use('/', picturesRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(logErrors);
app.use(clientErrorHandler);


app.listen(PORT, () => {
	console.log(`Servidor corriendo en el puerto ${PORT}`);
});
