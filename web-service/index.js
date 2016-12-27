/**
 * @file web-service
 */

const express = require('express');
const app = express();

// create an error with .status. we
// can then use the property in our
// custom error handler (Connect repects this prop as well)
function error(status, msg) {
    let err = new Error(msg);
    err.status = status;
    return err;
}

// if we wanted to supply more than JSON, we could
// use something similar to the content-negotiation
// example.

// here we validate the API key,
// by mounting this middleware to /api
// meaning only paths prefixed with "/api"
// will cause this middleware to be invoked
app.use('/api', (req, res, next) => {
    const key = req.query['api-key'];

    // key isn't present
    if (!key) return next(error(400, 'api key required'));

    // key is invalid
    if (!~apiKeys.indexOf(key)) return next(error(401, 'invalid api key'));

    // all good, store req.key for route access
    req.key = key;
    next();
});

// map of valid api keys, typically mapped to
// account info with some sort of database like redis.
// api keys do _not_ serve as authentication, merely to
// track API usage or help prevent malicious behavior etc.
const apiKeys = ['foo', 'bar', 'baz'];

// these two objects will serve as our faux database
const repos = [
    { name: 'express', url: 'http://github.com/expressjs/express' },
    { name: 'stylus', url: 'http://github.com/learnboost/stylus' },
    { name: 'cluster', url: 'http://github.com/learnboost/cluster' }
];
const users = [
    { name: 'tobi' },
    { name: 'loki' },
    { name: 'jane' }
];
const userRepos = {
    tobi: [repos[0], repos[1]],
    loki: [repos[1]],
    jane: [repos[2]]
};

// we now can assume the api key is valid,
// and simply expose the data
app.get('/api/users', (req, res, next) => {
    res.send(users);
});

app.get('/api/repos', (req, res, next) => {
    res.send(repos);
});

app.get('/api/user/:name/repos', (req, res, next) => {
    const name = req.params.name;
    const user = userRepos[name];
    if (user) res.send(user);
    else next();
});

// middleware with an arity of 4 are considered
// error handling middleware. When you next(err)
// it will be passed through the defined middleware
// in order, but ONLY those with an arity of 4, ignoring
// regular middleware.
app.use((err, req, res, next) => {
    // whatever you want here, feel free to populate
    // properties on `err` to treat it differently in here.
    res.status(err.status || 500);
    res.send({ error: err.message });
});

// our custom JSON 404 middleware. Since it's placed last
// it will be the last middleware called, if all others
// invoke next() and do not respond.
app.use((req, res) => {
    res.status(404);
    res.send({ error: "Lame, can't find that" });
});

app.listen(3000);
console.log('Express started on port 3000');
