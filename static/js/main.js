var row = $("#messages");

function newMessage(from, bodyText) {
	var newMessage = $('<div />').attr('class', 'col-md-3 message').css('display', 'none');

	var sender = $('<p />').attr('class', 'sender');
	sender.append(from);

	var bodyMessage = $('<p />').attr('class', 'content');
	bodyMessage.append(bodyText);

	newMessage.append(sender);
	newMessage.append(bodyMessage);

	row.append(newMessage);
	newMessage.show(1500);

	setTimeout(function(){ newMessage.hide(2000, function finallyRemove(){newMessage.remove()}); }, 10 * 1000);
}

function initialize() {
	$.ajax('api/contactConfig')
	.done(function(data){
		if (data.phoneActive) {
			$('#contactPhone').append(data.phoneAccount);
			$('#contactPhone').show();
		} else {
			$('#contactPhone').hide();
		}
		if (data.twitterActive) {
			$('#contactTwitter').append(data.twitterAccount);
			$('#contactTwitter').show();
		} else {
			$('#contactTwitter').hide();
		}
		if (data.facebookActive) {
			$('#contactFacebook').append(data.facebookAccount);
			$('#contactFacebook').show();
		} else {
			$('#contactFacebook').hide();
		}
		if (data.emailActive) {
			$('#contactEmail').append(data.emailAccount);
			$('#contactEmail').show();
		} else {
			$('#contactEmail').hide();
		}
	})
	.fail(function(jqXHR, textStatus, errorThrown){
		console.log(errorThrown);
	});
}

function handleIncommingCommand(command) {
	if (!command.action) {
		console.log('No action defined');
		return;
	}

	switch (command.action) {
		case 'newMessage':
			newMessage(command.from, command.body);
			break;
		case 'reset':
			initialize();
			break;
		default:
			console.log('No action defined!');
			break;
	}
}

var socket;
var reconnectInterval;
function createSocket() {
        socket = eio('ws://localhost:8080');
        socket.on('open', function(){
		if (reconnectInterval) {
			clearInterval(reconnectInterval);
			reconnectInterval = undefined;
		}
                console.log('connected');
                $('#connectionStateOk').show();
                $('#connectionStateUnknown').hide();
                $('#connectionStateBroken').hide();
        });
	socket.on('message', function(data) {
		var command = JSON.parse(data);

		handleIncommingCommand(command);
	});
	socket.on('error', function(error) {
		console.log('Connection to server failed: ', error);
		$('#connectionStateOk').hide();
                $('#connectionStateUnknown').hide();
                $('#connectionStateBroken').show();
		if (!reconnectInterval) reconnectInterval = setInterval(function tryReconnect(){
			console.log('Trying reconnect');
			createSocket();
		}, 3 * 1000);
	});
        socket.on('close', function(message) {
                console.log('Connection to server closed: ' + message);
                $('#connectionStateOk').hide();
                $('#connectionStateUnknown').hide();
                $('#connectionStateBroken').show();
		if (!reconnectInterval) reconnectInterval = setInterval(function tryReconnect(){
                        console.log('Trying reconnect');
                        createSocket();
                }, 3 * 1000);
        });
}

$(document).ready(function(){
	var s = $('#slideshow');
	s.slick({
		prevArrow:'',
		nextArrow:'',
		dots: false,
		infinite: true,
		speed: 1000,
		fade: true,
		slide: 'div',
		autoplay: true,
		autoplaySpeed: 2000,
	});

	var socket = createSocket();

	initialize();
});
