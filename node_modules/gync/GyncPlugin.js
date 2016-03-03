"use strict";

class GyncPlugin {
	getInstance() {
		throw "You need to specify the instance of the plugin handler";
	}

	handle(value) {
		throw "You need to specify the handler of the plugin";
	}
}

module.exports = GyncPlugin;