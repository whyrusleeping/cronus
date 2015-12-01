var path = require('path');
var express = require('express');
var webpack = require('webpack');
var config = require('./webpack.config.dev');
var proxy = require('proxy-middleware');
var url = require('url');

var app = express();
var compiler = webpack(config);

// Setup proxy to pass through to the gateway on port 8080
var passthrough = url.parse('http://localhost:8080/');

passthrough.headers = {'referer': 'https://localhost:8080'};
passthrough.cookieRewrite = true;

// Pass through request to the API and ipfs
app.use('/ipfs', proxy(passthrough));
app.use('/api', proxy(passthrough));

// magic
app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(3000, 'localhost', function(err) {
    if (err) {
        console.log(err);
        return;
    }

    console.log('Listening at http://localhost:3000');
});
