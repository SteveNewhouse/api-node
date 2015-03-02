var port            = process.env.PORT || 5000;
var mongoose        = require('mongoose');
var request         = require('request');
var _               = require('underscore');
var configDB        = require('./config/database.js')(mongoose);
var Assignment      = require('./models/assignment');

var BASE_URL        = 'https://api.dev.workmarket.com/api/v1';  // Point to the environment you are using
var TOKEN           = 'jsbe5DesTUmPCAHR6tTy'; // Replace with your token
var SECRET          = 'VwozCZGwZAupaEZkmvpR2pybJZ7xNJHTMoY2Aq7G'; // Replace with your secret
var ACCESS_TOKEN    = ''; // Don't set this

var lastTimeStamp = Date.now();
var pollingIntervalInMinutes = 0.1; // PLEASE do not go below 2 (minutes) here!

var updateTokenRunner = setInterval(refreshAccessToken(TOKEN, SECRET), (1000 * 60 * 60 * 24));
var updateRunner = setInterval(pollForUpdates, (pollingIntervalInMinutes * 1000 * 60));

function refreshAccessToken(token, secret, callback) {
	request.post({
		url: BASE_URL + '/authorization/request',
		form: {token: token, secret: secret}
	}, function (error, response, body) {
		var apiResponse = JSON.parse(body);

		if (!error && response.statusCode == 200) {
			ACCESS_TOKEN = apiResponse.response.access_token;
			if (callback) {
				callback();
			}
		} else {
			console.log(error);
		}
		console.log(apiResponse);
	})
}

function processAssignmentList(assignmentList) {
	_.each(assignmentList, function (assignment) {
		getAssignment(assignment.id, function (assignment) {
			Assignment.findOneAndUpdate({'id': assignment.id}, assignment, {upsert: true}, function(err, assignment) {
				if (err) {
					console.log(err);
					return;
				}
				console.log(JSON.stringify(assignment));
			});
		})
	});
}

function pollForUpdates() {
	request.get({
		url: BASE_URL + '/assignments/list_updated?access_token=' + ACCESS_TOKEN + '&modified_since=' + lastTimeStamp
	}, function (error, response, body) {
		var apiResponse = JSON.parse(body);

		if (!error && response.statusCode == 200) {
			// update timestamp
			lastTimeStamp = apiResponse.meta.timestamp;
			processAssignmentList(apiResponse.response.data);
		} else {
			console.log(error);
		}
		console.log(apiResponse);
	})
}

function getAssignment(id, callback) {
	request.get({
		url: BASE_URL + '/assignments/get?access_token=' + ACCESS_TOKEN + '&id=' + id
	}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var responseJSON = JSON.parse(body);
			callback(responseJSON.response);
		} else {
			console.log(error);
		}
	});
}
