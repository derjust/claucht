var postal = require('postal');
var getAllMessages = require('./db').getAllMessages;
var getMessageStatistics = require('./db').getMessageStatistics;
var _ = require('underscore');

function dashboard(app) {

	var clientChannel = postal.channel( "clientChannel" );

	app.get('/dashbaord/messages', function (req, res) {
		getAllMessages(function (err, messages){
			if (err) {
				return res.status(500).send(err);
			} else {
				res.status(200).json(messages);
			}
		});
		
	});


	app.get('/dashbaord/stats', function (req, res) {
		getMessageStatistics(function (err, messages){
			if (err) {
				return res.status(500).send(err);
			} else {
				
				res.status(200).json(_.map(messages, function(message){
					return {time: message._id, amount: message.value};

				}));
			}
		});
		
	});


}

exports.dashboard = dashboard;