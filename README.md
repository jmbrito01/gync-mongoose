#gync-mongoose

A simple Gync plugin for handling mongoose 
promises

### How to use
```
const 
    Gync = require('gync'),
    gyncMongoose = require('gync-mongoose'),
    mongoose = require('mongoose'),
    User = mongoose.model('User');

Gync.run({
    plugins: [ gyncMongoose ]
}, function* () {
    let user = yield User.create({
        email: 'test@test.com',
        password: '1234'
    });
    return user;
}).then(function(user) {
    console.log(`User created: ${user}`);
}, function(error) {
    throw error;
});
```

For more informations check the [Gync repository](https://github.com/jmbrito01/gync)