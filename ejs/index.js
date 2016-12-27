/**
 * @file ejs模版处理
 */

const app = require('express')();

// 注册ejs作为.html的模版引擎，如果不这样子的话，
// 我们需要命名为foo.ejs而不是foo.html
// __express方法只是一个用来将ejs模版引擎挂载在express
// 上的一个钩子函数，如果想用.html而不是.ejs，那么就要传递
// 一个函数进去，在这里就是ejs.__express
app.engine('.html', require('ejs').__express);

// 设置views的路径
app.set('views', __dirname + '/views');

// 这个是用来设置模版引擎的
// 这里用的是html，上面设置了用ejs来处理html
// 可以选择用其他插件例如jade
app.set('view engine', 'html');

// Dummy users
const users = [
    { name: 'tobi', email: 'tobi@learnboost.com' },
    { name: 'loki', email: 'loki@learnboost.com' },
    { name: 'jane', email: 'jane@learnboost.com' }
];

app.get('/', (req, res) => {
    // 将自定义参数传入模版中
    // 然后在模版中可以使用各种参数
    // in this case: users, title, header
    res.render('users', {
        users: users,
        title: "EJS example",
        header: "Some users"
    });
});

app.listen(3000);
console.log('Express started on port 3000');
