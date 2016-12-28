/**
 * @file 下载
 */

const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('<ul>'
        + '<li>Download <a href="/files/amazing.txt">amazing.txt</a>.</li>'
        + '<li>Download <a href="/files/missing.txt">missing.txt</a>.</li>'
        + '<li>Download <a href="/files/CCTV大赛上海分赛区.txt">CCTV大赛上海分赛区.txt</a>.</li>'
        + '</ul>');
});

// /files/* is accessed via req.params[0]
// but here we name it :file
app.get('/files/:file(*)', (req, res, next) => {
    const file = req.params.file;
    const path = __dirname + '/files/' + file;

    res.download(path, err => {
        if (!err) return; // file sent
        if (err && err.status !== 404) return next(err); // non-404 error
        // file for download not found
        res.statusCode = 404;
        res.send('Cant find that file, sorry!');
    });
});

app.listen(3000);
console.log('Express started on port 3000');
