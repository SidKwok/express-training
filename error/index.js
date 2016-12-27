/**
 * @file 错误处理
 */

const express = require('express');
const logger = require('morgan');
const app = express();
const test = app.get('env') == 'test';

if (!test) app.use(logger('dev'));

// 错误处理中间件有四个参数，但是它和一般的中间件表现行为一致
// 一个应用应该有多个error中间件来处理不同的错误情况
function error(err, req, res, next) {
    // log it
    if (!test) console.error(err.stack);

    // respond with 500 "Internal Server Error".
    res.status(500);
    res.send('Internal Server Error');
}

app.get('/', (req, res) => {
    // 引发错误处理
    throw new Error('something broke!');
});

app.get('/next', (req, res, next) => {
    // 我们可以将异常用next()来传递
    // 用process.nextTick()是为了证明next()
    // 可以在异步操作中调用
    // 在业务中通常是用来数据库查询和http请求
    process.nextTick(() => {
        next(new Error('oh no!'));
    });
});

// error中间件应该放在路由的最后
// 如果不这样子的话就没有办法捕获到错误
app.use(error);

app.listen(3000);
console.log('Express started on port 3000');
