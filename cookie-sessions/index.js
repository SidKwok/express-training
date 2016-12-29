/**
 * 处理sessions
 */

const cookieSession = require('cookie-session');
const express = require('express');

const app = module.exports = express();

// add req.session cookie support
app.use(cookieSession({ secret: 'manny is cool' }));

// do something with the session
app.use(count);

// custom middleware
function count(req, res) {
    req.session.count = req.session.count || 0;
    let n = req.session.count++;
    res.send('viewed ' + n + ' times\n');
}

app.listen(3000);
console.log('Express started on port 3000');
