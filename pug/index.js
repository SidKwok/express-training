/**
 * @file pug模版引擎处理
 */
const express = require('express');
const app = express();

// 使用express.static()中间件
// 设置静态文件
app.use(express.static(__dirname + '/public'));

// 是指views的路径
app.set('views', __dirname + '/views');

// 设置模版引擎为jade
app.set('view engine', 'pug');

function User(name, email) {
    this.name = name;
    this.email = email;
}

// Dummy users
const users = [
    new User('tj', 'tj@vision-media.ca'),
    new User('ciaran', 'ciaranj@gmail.com'),
    new User('aaron', 'aaron.heckmann+github@gmail.com')
];

app.get('/', (req, res) => {
    res.render('users', { users: users });
});

// use是使用中间件来处理
// 这里是错误处理
// 更好的做法是使用相应的error handler来处理错误
// 将错误打印到页面上面是不明智的行为
app.use((err, req, res, next) => {
    res.send(err.stack);
});

app.listen(3000);
console.log('Express started on port 3000');
