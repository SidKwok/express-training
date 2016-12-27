/**
 * @file 处理markdown文件
 */

const escapeHtml = require('escape-html');
const express = require('express');
const fs = require('fs');
const marked = require('marked');
const app = express();

// 将后缀名为.md的文件注册为一个express的模版引擎
app.engine('md', (path, options, fn) => {
    fs.readFile(path, 'utf8', function(err, str){
        if (err) return fn(err);
        let html = marked.parse(str).replace(/\{([^}]+)\}/g, (_, name) => {
            return escapeHtml(options[name] || '');
        });
        fn(null, html);
    });
});

// 设置views的路径
app.set('views', __dirname + '/views');

// 使用上面设置的md引擎
app.set('view engine', 'md');

app.get('/', (req, res) => {
    res.render('index', { title: 'Markdown Example' });
});

app.get('/fail', (req, res) => {
    res.render('missing', { title: 'Markdown Example' });
});

app.listen(3000);
console.log('Express started on port 3000');
