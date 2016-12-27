/**
 * @file 路由映射
 */

var app = require('express')();

app.map = (a, route) => {
    route = route || '';
    for (var key in a) {
        switch (typeof a[key]) {
            case 'object':
                app.map(a[key], route + key);
                break;
            case 'function':
                console.log('%s %s', key, route);
                app[key](route, a[key]);
                break;
            }
      }
};

const users = {
    list(req, res) {
        res.send('user list');
    },

    get(req, res) {
        res.send('user ' + req.params.uid);
    },

    delete(req, res){
        res.send('delete users');
    }
};

const pets = {
    list(req, res) {
        res.send('user ' + req.params.uid + '\'s pets');
    },

    delete(req, res) {
        res.send('delete ' + req.params.uid + '\'s pet ' + req.params.pid);
    }
};

app.map({
    '/users': {
        get: users.list,
        delete: users.delete,
        '/:uid': {
            get: users.get,
            '/pets': {
                get: pets.list,
                '/:pid': {
                    delete: pets.delete
                }
            }
        }
    }
});

app.listen(3000);
console.log('Express started on port 3000');
