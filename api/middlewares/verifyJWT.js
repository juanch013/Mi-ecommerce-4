const jwt = require('jsonwebtoken');
const { SECRETORPRIVATEKEY } = process.env;

const verifyJWT = (req, res, next) => {
	try {
		// Se obtiene el token del header
		const { authorization: token } = req.headers;

		if (!token) {
			return res.status(401).json({
				auth: false,
				msg: 'No token provided',
			});
		}

		const decoded = jwt.verify(token, SECRETORPRIVATEKEY);

		req.newUsers = decoded;
		
		next();
	} catch (error) {
    console.log(error);
    res.status(401).json({
      auth: false,
      msg: 'Invalid token',
    });
  }
};

module.exports = {verifyJWT};
