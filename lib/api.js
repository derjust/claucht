var getContactConfiguration = require('./db').getContactConfiguration;
var saveContactConfiguration = require('./db').saveContactConfiguration;

function api(app) {

	app.get('/api/contactConfig', function (req, res) {
		res.status(200).json(getContactConfiguration());
	});

	app.post('/api/contactConfig', function (req, res) {
		saveContactConfiguration(req.body, function(err){
			if (err) {
				res.send(500).send(err);
			} else {
				res.status(204).end();
			}
		});
	});

	app.post('/admin/newMessage', function(req, res) {

		var form = req.body;

		var command = {
			action:'newMessage',
			body: form.message
		};
		_.each(sockets, function(socket) {
			socket.send(JSON.stringify(command));	
		});
	});

}

exports.api = api;
