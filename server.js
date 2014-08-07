/*
 * CreativeLive Programming Project
 * Started: 8/6/2014
 * Last Updated: 8/6/2014
 * Author: Kenner Miner
 */

var _ = require('lodash'),
	hapi = require('hapi'),
	shortId = require('shortId'),
	options = {
		views: {
			path: 'templates',
			engines: {
				ejs: require('ejs')
			}
		},
		debug: {
			request: ['error']
		}
	},
	server = hapi.createServer('localhost', process.argv[2] || 8080, options),
	jsonData = require('./data/bands.json'),
	bandsObject = {
		default: {}
	};

server.state('session', {
	ttl: 30 * 24 * 60 * 60 * 1000
});

_.map(jsonData, function(band) {
	bandsObject.default[band.name] = band;
});

server.route({
	method: 'GET',
	path: '/{band?}',
	handler: function(req, res) {
		var session = getSession(req);

		res.view('index.ejs', {
			params: {
				// Display user's saved changes if they exist
				bands: bandsObject[session] || bandsObject.default,
				band: req.params.band
			}
		}).state('session', session);
	}
});

server.route({
	method: 'POST',
	path: '/{band}',
	handler: function(req, res) {
		var prevName = req.payload.originalName,
			curName = req.payload.name,
			session = getSession(req);

		// This user is making his/her first change! Copy over
		// the default bands for modification
		if (!bandsObject[session]) {
			bandsObject[session] = _.clone(bandsObject.default)
		}

		// Remove key for old band name
		if (prevName !== curName) {
			delete bandsObject[session][prevName];
		}

		delete req.payload.originalName;

		// Set the new band data
		bandsObject[session][curName] = req.payload;

		res.redirect('/' + curName).state('session', session);
	}
});

// Helper function to fetch an existing session value or create a new one
function getSession(req) {
	return req.state ? req.state.session : shortId.generate();
}

server.start(function() {
	console.log('Server started at', server.info.uri);
});