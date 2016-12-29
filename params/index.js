/**
 * @file params 处理
 */

const express = require('express');
const app = module.exports = express();

// Faux database

const users = [
    { name: 'tj' },
    { name: 'tobi' },
    { name: 'loki' },
    { name: 'jane' },
    { name: 'bandit' }
];

// Create HTTP error

function createError(status, message) {
  let err = new Error(message);
  err.status = status;
  return err;
}

// Convert :to and :from to integers

app.param(['to', 'from'], (req, res, next, num, name) => {
    req.params[name] = parseInt(num, 10);
    if(isNaN(req.params[name])){
        next(createError(400, `failed to parseInt  ${num}`));
    } else {
        next();
    }
});

// Load user by id

app.param('user', (req, res, next, id) => {
    if (req.user = users[id]) {
        next();
    } else {
        next(createError(404, 'failed to find user'));
    }
});

/**
 * GET index.
 */

app.get('/', (req, res) => {
    res.send('Visit /user/0 or /users/0-2');
});

/**
 * GET :user.
 */

app.get('/user/:user', (req, res, next) => {
    res.send('user ' + req.user.name);
});

/**
 * GET users :from - :to.
 */

app.get('/users/:from-:to', (req, res, next) => {
    const from = req.params.from;
    const to = req.params.to;
    const names = users.map(user => user.name);
    res.send('users ' + names.slice(from, to).join(', '));
});

app.listen(3000);
console.log('Express started on port 3000');
