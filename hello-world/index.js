/**
 * @file hell world
 */
const app = require('express')();

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.listen(3000);
console.log('Express started on port 3000');
