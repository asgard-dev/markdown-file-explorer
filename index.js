var express = require('express');
var app = express();
var mdwebserv = require('./src/FileExplorer');

mdwebserv.init(app, express);

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.get('/*', function (req, res, next) {
    var response =  mdwebserv.processRequest(req);
    if(response == null) {
        next();
    } else {
        res.send(response);
    }
});

app.use(express.static('.'));
app.use(express.static(mdwebserv.rootPath));

app.get('/*', function (req, res) {
    res.send(mdwebserv.notFoundPage());
});

app.listen(80, function () {
    console.log('INFO - Webserver is listening on port 80!');
});