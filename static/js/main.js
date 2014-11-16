var row = $("#messages");

$("#generateMessage").on('click', function() {

	var newMessage = $('<div />').attr('class', 'col-md-3 message').css('display', 'none');

	var bodyMessage = $('<p />');
	bodyMessage.append('Donec sed odio dui. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Vestibulum id ligula porta felis euismod semper. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus.');

	newMessage.append(bodyMessage);

	row.append(newMessage);
	newMessage.show(1500);

	    setTimeout(function(){ newMessage.hide(2000, function finallyRemove(){newMessage.remove()}); }, 10 * 1000);


});

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



});
