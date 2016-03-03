'use strict';

const Gync = require('gync');

class FirstPlugin extends Gync.Plugin {
	//The getInstance function needs to return the instance to be handled by this plugin, in this case, functions
	getInstance() {
		return Function;
	}

	//THe handle function needs to resolve the value yield by the user and return a promise.
	handle(value) {
		return new Promise(function(resolve, reject) {
			resolve(value.name)
		});
	}
}

Gync.run({
	plugins: [ FirstPlugin ]
}, function* () {
	var msg = yield function HelloWorld() {};
	return msg;
}).then(function(msg) {
	console.log(msg);
	//Prints how `HelloWorld`
});