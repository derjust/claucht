var _ = require('underscore');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/claucht');

var contactConfig;

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {

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

function getContactConfiguration() {
	return _.omit(
		JSON.parse(JSON.stringify(contactConfig)),  //Remove mongoose prototype
		'_id', '__v'); //Remove mongose fields
}

function saveContactConfiguration(newConfig, fn) {
	console.log(newConfig);
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
