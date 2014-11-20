var row = $("#messages");

function newMessage(bodyText) {
	var newMessage = $('<div />').attr('class', 'col-md-3 message').css('display', 'none');

	var bodyMessage = $('<p />');
	bodyMessage.append(bodyText);

	newMessage.append(bodyMessage);

	row.append(newMessage);
	newMessage.show(1500);

	setTimeout(function(){ newMessage.hide(2000, function finallyRemove(){newMessage.remove()}); }, 10 * 1000);


}

function handleIncommingCommand(command) {
	if (!command.action) {
		console.log('No action defined');
		return;
	}

	switch (command.action) {
		case 'newMessage':
			newMessage(command.body);
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
});
