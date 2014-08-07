var _ = require('lodash'),
	hapi = require('hapi'),
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
	bandsObject = {};

_.map(jsonData, function(band) {
	bandsObject[band.name] = band;
});

server.route({
	method: 'GET',
	path: '/{band?}',
	handler: function(req, res) {
		res.view('index.ejs', {
			params: {
				bands: bandsObject,
				band: req.params.band
			}
		});
	}
});

server.route({
	method: 'POST',
	path: '/{band}',
	handler: function(req, res) {
		var prevName = req.payload.originalName,
			curName = req.payload.name;

		if (prevName !== curName) {
			delete bandsObject[prevName];
		}

		delete req.payload.originalName;

		bandsObject[curName] = req.payload;

		res.redirect('/' + curName);
	}
});

server.start(function() {
	console.log('Server started at', server.info.uri);
});