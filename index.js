'use strict';

const
    Gync        = require('gync'),
    mongoose    = require('mongoose');
    

class GyncMongoose extends Gync.Plugin {
    getInstance() {
        return mongoose.Query;
    }
    
    handle(value) {
        return new Promise(function(resolve, reject) {
            value.then(resolve, reject);
        });
    }
}

module.exports = GyncMongoose;