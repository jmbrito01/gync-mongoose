var Gync = require('..');

function promiseTest(arg) {
	return new Promise(function(resolve) {
		setTimeout(function() {
			resolve(arg);
		}, 20);
	});
}

function onResolve(results) {
	console.log(results);
}

function onReject(error) {
	throw error;
}

Gync.run(function* () {
	var results = yield* Gync.fetch([
		promiseTest(0), promiseTest(1), promiseTest(2)
	]);
	return results;
}).then(onResolve, onReject);

