var Gync = require('../');
var fs = require('fs');

//This is just an example function that uses promises.
function readFile(path) {
	return new Promise(function(resolve, reject) {
		fs.readFile(path, function(err, data) {
			if (err) reject(err);
			else resolve(data);
		});
	});
}

//For using Gync you will need to write your sync code inside a generator function, like this:
function* readFileSync() {
	//You'll need to use the yield before calling the function, thats because we need to freeze the
	// execution untill the promise gets back the result.
	var file = yield readFile('./example_file.json');
	return JSON.parse(file);
}

//Gync.run returns a promise
Gync.run(readFileSync).then(function(file) {
	console.log(file);
}, function(error) {
	console.log('ERROR: ', error);
});