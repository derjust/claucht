var _ = require('underscore');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/claucht');

var contactConfig;
var MessageModel;

var db = mongoose.connection;
db.on('error', function callback(err) {
	console.error('connection error: ', err);
	throw err;
});
db.once('open', function callback () {

	var messageSchema = mongoose.Schema({
  		id: mongoose.Schema.Types.ObjectId,
		sender: String,
		body: mongoose.Schema.Types.Mixed,
		type: { type: String, enum: ['SMS', 'MMS', 'TWITTER', 'EMAIL', 'FACEBOOK', 'ADMIN'] },
		received: Date
	});
	MessageModel = mongoose.model('MessageModel', messageSchema);

	var contactConfigSchema = mongoose.Schema({
    	twitterAccount: String,
    	twitterActive: {type:Boolean, default: false},

    	facebookAccount: String,
    	facebookActive: {type:Boolean, default: false},

    	emailAccount: String,
    	emailActive: {type:Boolean, default: false},

    	phoneAccount: String,
    	phoneActive: {type:Boolean, default: false}
	});
	var ContactConfig = mongoose.model('ContactConfig', contactConfigSchema);


	ContactConfig.find(function(err, contactConfigs) {
		if (contactConfigs.length === 0) {
			contactConfig = new ContactConfig();
			contactConfig.save(function (err, result) {
			if (err)
				throw err;
			
			});
		} else {
			contactConfig = contactConfigs[0];
		}
	});

});

function createMessageAdmin(body) {
	adminMessage = new MessageModel();
	adminMessage.type = 'ADMIN';
	adminMessage.sender = 'Staff';
	adminMessage.received = new Date();
	adminMessage.body = body;

	adminMessage.save(function(err) {
		if (err) {
			console.err('Could not persist messages: ', err);
		}
	});

	return adminMessage;
}

function getMessageStatistics(fn) {
	MessageModel.mapReduce({
		map: function map() { 
			// Use only up to the minute but let it be still a valid ISO time string be
			var year = this.received.toISOString().slice(0, 16) + ':00.000Z'; 
			emit( year, 1);
		}, 
		reduce: function reduce(key, values) {
			return Array.sum(values);
		},
		out: { replace: 'createdCollectionNameForResults' }
		}, function (err, model, stats) {
	  		console.log('map reduce took %d ms', stats.processtime)
	  		model.find(function (err, docs) {
	    	fn(undefined, docs);
	  	});
	});
}

function getAllMessages(fn) {
	MessageModel.find(function(err, messages) {
		if (err) {
			fn(err);
		} else {
			console.log(messages);
			fn(undefined, JSON.parse(JSON.stringify(messages)));
		}
	});
}

function getContactConfiguration() {
	return _.omit(
		JSON.parse(JSON.stringify(contactConfig)),  //Remove mongoose prototype
		'_id', '__v'); //Remove mongose fields
}

function saveContactConfiguration(newConfig, fn) {
	contactConfig.twitterActive = newConfig.twitterActive;
	if (contactConfig.twitterActive) {
		contactConfig.twitterAccount = newConfig.twitterAccount
	} else {
		contactConfig.twitterAccount = undefined;
	}

	contactConfig.facebookActive = newConfig.facebookActive;
	if (contactConfig.facebookActive) {
		contactConfig.facebookAccount = newConfig.facebookAccount;
	} else {
		contactConfig.facebookAccount = undefined;
	}

	contactConfig.emailActive = newConfig.emailActive;
	if (contactConfig.emailActive) {
		contactConfig.emailAccount = newConfig.emailAccount;
	} else {
		contactConfig.emailAccount = undefined;
	}

	contactConfig.phoneActive = newConfig.phoneActive;
	if (contactConfig.phoneActive) {
		contactConfig.phoneAccount = newConfig.phoneAccount;
	} else {
		contactConfig.phoneAccount = undefined;
	}

	contactConfig.save(function (err, result) {
		if (err) {
			return fn(err);
		} 
		contactConfig = result;
		return fn(undefined, getContactConfiguration());
	});
}

exports.getContactConfiguration = getContactConfiguration;
exports.saveContactConfiguration = saveContactConfiguration;
exports.createMessageAdmin = createMessageAdmin;
exports.getAllMessages = getAllMessages;
exports.getMessageStatistics = getMessageStatistics;