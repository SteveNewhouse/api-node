// Using default mongo port
var mongoUri = 'mongodb://localhost:27017/api-node';

module.exports = {
	'url' : mongoUri
};

module.exports = function(mongoose) {

	mongoose.connection.on('error', function(err) {
		console.error('MongoDB error: %s', err);
	});

	mongoose.connect(mongoUri, function (err, res) {
		if (err) {
			console.log ('ERROR connecting to: ' + mongoUri + '. ' + err + '\n');
		} else {
			console.log ('Successfully connected to: ' + mongoUri + '\n');
		}
	});
};

