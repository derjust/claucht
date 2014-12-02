var postal = require('postal');

var subscription = postal.subscribe({
	channel: 'messages',
	topic: 'item.add', 
	callback: function(data, envelope) {

	}
});

