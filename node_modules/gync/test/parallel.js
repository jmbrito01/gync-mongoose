var Gync = require('..');

describe('Gync', function() {
	describe('#parallel', function() {
		it('should return an array with the results of the promises', function(done) {
			Gync.run(function* () {
				var results = yield* Gync.parallel([
					Promise.resolve(true),
					Promise.resolve(false)
				]);
				return results;
			}).then(onResolve, onReject);

			function onResolve(results) {
				if (Array.isArray(results)) done();
			}

			function onReject(error) {
				throw error;
			}
		});
	});
});