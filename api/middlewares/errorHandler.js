function logErrors(err, req, res, next) {
	console.log(err);
	next(err);
}

function clientErrorHandler(err, req, res, next) {
	res.status(500).json({
		error: err.message,
		message: 'Talk to the administrator',
	});
}

module.exports = {
  logErrors,
  clientErrorHandler,
};



