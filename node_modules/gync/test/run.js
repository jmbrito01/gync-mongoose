'use strict';

var Gync = require('../');
var fs = require('fs');

describe('Gync', function() {
	describe('#run', function() {
		it('should trigger reject if no generator specified', function(done) {
			Gync.run().then(onResolve, onReject);

			function onResolve() {
				throw "Resolved some value";
			}

			function onReject() {
				done();
			}
		});
		it('should trigger reject if not specified a generator', function(done) {
			Gync.run(function() {

			}).then(onResolve, onReject);

			function onResolve() {
				throw "Resolved some value";
			}

			function onReject() {
				done();
			}
		});
		it('should return the result of the generator function', function(done) {
			Gync.run(function* () {
				return true;
			}).then(onResolve, onReject);

			function onResolve(value) {
				if (value) done();
				else throw "Returned invalid value";
			}

			function onReject(error) {
				throw error;
			}
		});

		it('should execute promises synchronously', function(done) {
			Gync.run(function* () {
				function promiseTest() {
					return new Promise(function (resolve, reject) {
						resolve(true);
					});
				}
				try {
					var result = yield promiseTest();
					return result;
				} catch (e) {
					throw e;
				}
			}).then(onResolve, onReject);

			function onResolve(result) {
				if (result) done();
			}

			function onReject(error) {
				throw error;
			}
		});

		it('should execute the callback using the resume parameter', function(done) {
			Gync.run(function* (resume) {
				function callbackTest(cb) {
					setTimeout(function() {
						cb(null, true);
					}, 20);
				}

				var result = yield callbackTest(resume);
				return result;
			}).then(onResolve, onReject);

			function onResolve(result) {
				if (result) done();
			}

			function onReject(error) {
				throw error;
			}
		});

		it('should resolve the promise and return the value if generator returns a promise', function(done) {
			Gync.run(function* () {
				function promiseTest() {
					return new Promise(function(resolve) {
						setTimeout(function() {
							resolve(true);
						}, 20);
					});
				}

				return promiseTest()
			}).then(onResolve, onReject);

			function onResolve(result) {
				if (result) done();
			}

			function onReject(error) {
				throw error;
			}
		});

		it('should execute a plugin for a specific type of instance', function(done) {
			class Test {
				testCall() {
					return "Hello, world";
				}
			}
			class PluginTest extends Gync.Plugin {
				getInstance() {
					return Test;
				}
				handle(Value) {
					return new Promise(function(resolve) {
						let value = new Value();
						resolve(value.testCall());
					});
				}
			}

			Gync.run({
				plugins: [PluginTest]
			}, function* () {
				var str = yield Test;
				return str;
			}).then(function(str) {
				if (str === "Hello, world") {
					done();
				}
			}, function(error) {
				throw error;
			});
		});

	});
});