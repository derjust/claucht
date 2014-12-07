var postal = require('postal');
var getContactConfiguration = require('./db').getContactConfiguration;
var saveContactConfiguration = require('./db').saveContactConfiguration;
var createMessageAdmin = require('./db').createMessageAdmin;

function api(app) {

	var clientChannel = postal.channel( "clientChannel" );

	app.get('/api/contactConfig', function (req, res) {
		res.status(200).json(getContactConfiguration());
	});

	app.post('/api/contactConfig', function (req, res) {
		saveContactConfiguration(req.body, function(err){
			if (err) {
				res.send(500).send(err);
			} else {
				res.status(204).end();
				clientChannel.publish('reset');
			}
		});
	});

	app.post('/admin/newMessage', function(req, res) {

		var adminMessage = createMessageAdmin(req.body.message);
		clientChannel.publish('newMessage', adminMessage);

	});

}

exports.api = api;
