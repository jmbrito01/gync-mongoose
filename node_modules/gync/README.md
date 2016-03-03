# Gync

Gync is a simple asynchronous control flow framework that
gives you the hability to handle promises in a syncronous way.

### Example

```
var Gync = require('gync');
var fs = require('fs');

function readFile(path) {
    return new Promise(function(resolve, reject) {
        fs.readFile(path, function(err, data) {
            if (err) reject(err);
            else resolve(data);
        });

    });
}

Gync.run(function* (resume) {
    var pkg = JSON.parse(yield readFile('./package.json'));
    var other = JSON.parse(yield readFile('./other.json'));

    var pkg_cb = JSON.parse(yield fs.readFile('./package.json', resume));

});
```

### Plugins
Gync from version 1.0.2 on accepts plugins to it's asynchronous
handler, here we describe a little about how it works.

**When to use?** Plugins are good when you need to handle a
specific type of async operation that gync does not support,
for example mongoose queries are also promises but not equal
to the native ones so gync dont recognize it as a promise.

**How to use?** A plugin is really simple to use, first you'll
have to create a new class that instances the GyncPlugin.
It should have basically 2 methods:
* `getInstance()` method should return a instance. This instance
is how Gync recognizes which plugin to activate in a `yield`.
So if you want to execute this plugin everytime someone yields
a function, you should return a Function instance
* `handle(value)` method should return a promise, the value
passed as argument is the variable which was yield by the user

```
const Gync = require('gync');

class FirstPlugin extends Gync.Plugin {
    getInstance() {
        return Function;
    }

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
});
```

### References

#### Gync.run(opts, generator)
Executes a generator synchronously and returns a promise for
the result of the generator.

##### Parameters
* **opts:** An object containing the following options
    * _plugins_: An array containing all plugin classes
    which will be used in the generator
    * _args_: An array containing the arguments which will
    be passed to the generator.
* **generator:** The generator function to be executed

#### Gync.fetch(promises)
This is a generator helper to be used inside your generators.
It basically executes all the promises in the array before
unpause the function

##### Parameters
* **promises:** An array of promises to be executed

#### Gync.parallel(promises)
This generator at first glance may look like Gync.fetch
 but it isn't, the fetch function waits the first result
 to start executing the next one and so on, in parallel
 we wrap Promise.all into the sync flow so the promises are
 executed in arrival order. But remember, the order that the
 callbacks arrive does not interfere in the order of the result
 array.

* **promises:** An array of promises to be execute

### Developer Notes

* If the reference is a generator and not a function
you can't call it, you have to use it inside the run function
with the yield*(the asterisk means that you are giving the
generator after the yield statement permission to yield
for you)


### Examples
This repository has a list of good examples for using it,
check out the examples directory for the codes, heres a summary

* **Simplest:** The simplest thing you can do with the library,
the gync hello world.
* **Fetch:** This is an example for using the fetch function
of the framework
* **Plugin:** This is a simple plugin for Gync for handling mongoose
query promises

### Tests
We use mocha for testing, to start the tests run `npm test` or
`mocha test`. There are currently 9 tests written and i'll try to contnue making for as the
library gets more sofisticated.

### Changelog
* **v1.0.1:**
    * Gsync.parallel generator
    * fetch and parallel new tests
* **v1.0.2**
    * Plugin system added



### License

The MIT License (MIT)
Copyright (c) <year> <copyright holders>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.