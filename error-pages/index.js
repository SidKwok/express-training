/**
 * @file 错误页面
 */

const express = require('express');
const app = express();
const logger = require('morgan');
const silent = 'test' == process.env.NODE_ENV;

// general config
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// 自定义设置
// 可以在模版中使用settings['verbose errors']
// enable的话就是ture, disable的话就是false
app.enable('verbose errors');

// disable them in production
// use $ NODE_ENV=production node examples/error-pages
if ('production' == app.settings.env) app.disable('verbose errors');

silent || app.use(logger('dev'));

// Routes
app.get('/', (req, res) => {
    res.render('index.ejs');
});

app.get('/404', (req, res, next) => {
    // 触发404，因为没有中间件适配/404，所以这里不需要响应
    next();
});

app.get('/403', (req, res, next) => {
    // trigger a 403 error
    let err = new Error('not allowed!');
    err.status = 403;
    next(err);
});

app.get('/500', (req, res, next) => {
  // trigger a generic (500) error
  next(new Error('keyboard cat!'));
});

// Error handlers

// Since this is the last non-error-handling
// middleware use()d, we assume 404, as nothing else
// responded.

// $ curl http://localhost:3000/notfound
// $ curl http://localhost:3000/notfound -H "Accept: application/json"
// $ curl http://localhost:3000/notfound -H "Accept: text/plain"

app.use((req, res, next) => {
    res.status(404);

    // respond with html page
    if (req.accepts('html')) {
        res.render('404', { url: req.url });
        return;
    }

    // respond with json
    if (req.accepts('json')) {
        res.send({ error: 'Not found' });
        return;
    }

    // default to plain-text. send()
    res.type('txt').send('Not found');
});

// error-handling middleware, take the same form
// as regular middleware, however they require an
// arity of 4, aka the signature (err, req, res, next).
// when connect has an error, it will invoke ONLY error-handling
// middleware.

// If we were to next() here any remaining non-error-handling
// middleware would then be executed, or if we next(err) to
// continue passing the error, only error-handling middleware
// would remain being executed, however here
// we simply respond with an error page.

app.use((err, req, res, next) => {
    // we may use properties of the error object
    // here and next(err) appropriately, or if
    // we possibly recovered from the error, simply next().
    res.status(err.status || 500);
    res.render('500', { error: err });
});

app.listen(3000);
console.log('Express started on port 3000');
