var util = require('util');
var _ = require('underscore');
var postal = require('postal');

function eventbus(sockets) {

	var clientChannel = postal.channel( "clientChannel" );

	function notifySockets(command, body) {
		var command = {
			action: command
		};
		if (body) {
			command.body = body;
		}
		_.each(sockets, function(socket) {
			socket.send(JSON.stringify(command));	
		});	
	}

	clientChannel.subscribe( "reset", function() {
		notifySockets('reset');
	});


	clientChannel.subscribe( "newMessage", function(message) {
		console.log(util.inspect(message));
		notifySockets('newMessage', message.body);
	});

}

exports.eventbus = eventbus;