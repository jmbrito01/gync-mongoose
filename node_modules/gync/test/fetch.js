var Gync = require('..');

describe('Gync', function() {
	describe('#fetch', function() {
		it('should handle all array promises synchronously', function(done) {
			Gync.run(function* () {
				function promiseTest(arg) {
					return new Promise(function(resolve) {
						setTimeout(function() {
							resolve(arg);
						}, 20);
					});
				}

				var result = Gync.fetch([
					promiseTest(true), promiseTest(true), promiseTest(true)
				]);
				return result;
			}).then(onResolve,  onReject);

			function onResolve(result) {
				var results = true;
				for (each of result) if (!each) results = false;
				if (results) done();
			}

			function onReject(error) {
				throw error;
			}
		});
	});
});