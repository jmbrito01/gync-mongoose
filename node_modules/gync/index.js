'use strict';

const GyncPlugin = require('./GyncPlugin');

//TODO: Document class
class Gync {
	constructor(opts) {
        this.plugins = opts.plugins || [];

	}

	plugin(module) {
		this.plugins.push(module);
	}

	static get Plugin() {
		return GyncPlugin;
	}

	static *fetch(promises) {
		let result = [];
		for (let each of promises) {
			result.push(yield each);
		}

		return result;
	}

	static *parallel(promises) {
		var result = yield Promise.all(promises);
		return result;
	}

    static run(opts, generator) {
		return new Promise(function (resolve, reject) {
			let Generator = (function*() {}).constructor;
			if (generator === undefined) {
				if (opts === undefined) {
					reject('No generator specified to be run');
					throw "No generator specified to be run";
				}

				generator = opts, opts = {
					args: [],
					plugins: [],
					display_alerts: false
				};
			}

			if (!(generator instanceof Generator)) {
				reject('The argument provided is not a function generator, try using function* instead of function');
				throw "'The argument provided is not a function generator, try using function* instead of function'";
			}

			//Initialize the iterator and fetch the first result
			if (!Array.isArray(opts.args)) opts.args = [];
			opts.args.push(resume);
			let iterator = generator.apply(generator, opts.args);
			fetchResult();

			function resume(err, result) {
				if (err) onError(err);
				else fetchResult(result);
			}

			function fetchResult(lastResult) {
				let result = iterator.next(lastResult);
				let isPromise = result.value instanceof Promise;
				if (result.done && !isPromise) {
					resolve(result.value);
				} else if (isPromise && !result.done) {
					//Is a promise, lets handle it before continue execution
					result.value.then(fetchResult, onError);
                } else if (isPromise && result.done) {
					result.value.then(resolve, reject);
				} else {
					//No default handler found, lets handle plugins
					opts.plugins.forEach(function(Each, idx) {
						var each = new Each();
						if (!(each instanceof GyncPlugin) && opts.display_alerts) {
							console.log(`[ GYNC WARNING ] Plugin idx (${idx}) is not a GyncPlugin instance, we recommend you use 'extends' GyncPlugin`);
						}
						if (result.value instanceof each.getInstance().constructor) {
							//This plugin handles the instance of the result
							each.handle(result.value).then(fetchResult, onError);
						}
					});

				}
			}

			function onError(error) {
				reject(error);
			}
		});
	}
}

module.exports = Gync;