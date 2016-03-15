let fs = require("fs");
let browserify = require("browserify");
let babelify = require("babelify");
let express = require('express');
let bodyParser = require('body-parser');
let path = require('path');
let request = require('request');
let server = express();

browserify({ debug: true })
  .transform(babelify)
  .transform({global: true}, 'uglifyify')
  .require("src/app.js", { entry: true })
  .bundle()
  .on("error", function (err) { console.log("Error: " + err.message); })
  .pipe(fs.createWriteStream("public/javascripts/bundle.js"));

server.engine('html', require('ejs').renderFile);
server.use(bodyParser.urlencoded({ extended: true }));
server.use(express.static('public'));
server.use(express.static('bower_components'));
server.set('views', './')

var baseRequest = request.defaults({
  headers: {
    'User-Agent': 'okhttp/3.2.0',
    'X-Robinhood-API-Version': '1.60.1'
  }
})

function proxyRequest(options, res) {
  baseRequest(options, function (error, response, body) {
    res.header("Content-Type", "application/json");
    if (!error && response.statusCode == 200) {
      res.status(response.statusCode).send(body);
    } else {
      res.status(response.statusCode).send(error);
    }
  });
}

server.get('/', function (req, res) {
  res.render('index.html');
});

server.get('/user', function (req, res) {
  var options = {
    url: 'https://api.robinhood.com/user/',
    method: 'GET',
    headers: {
      "Authorization": "Token " + req.query.token
    }
  };
  proxyRequest(options, res);
});

server.get('/accounts', function (req, res) {
  var options = {
    url: 'https://api.robinhood.com/accounts/',
    method: 'GET',
    headers: {
      "Authorization": "Token " + req.query.token
    }
  };
  proxyRequest(options, res);
});

server.get('/accounts/:account_id', function (req, res) {
  var options = {
    url: 'https://api.robinhood.com/accounts/' + req.params.account_id,
    method: 'GET',
    headers: {
      "Authorization": "Token " + req.query.token
    }
  };
  proxyRequest(options, res);
});

server.get('/accounts/:account_id/portfolio', function (req, res) {
  var options = {
    url: 'https://api.robinhood.com/accounts/' +
      req.params.account_id + '/portfolio',
    method: 'GET',
    headers: {
      "Authorization": "Token " + req.query.token
    }
  };
  proxyRequest(options, res);
});

server.post('/auth', function (req, res) {
  var options = {
    url: 'https://api.robinhood.com/api-token-auth/',
    form: req.body,
    method: 'POST'
  };
  proxyRequest(options, res);
});

server.get('/positions/:account_id', function (req, res) {
  var options = {
    url: 'https://api.robinhood.com/positions/',
    method: 'GET',
    qs: {
      nonzero: true,
      account: '/accounts/' + req.params.account_id + '/'
    },
    headers: {
      "Authorization": "Token " + req.query.token
    }
  };
  proxyRequest(options, res);
});

server.get('/instruments/:instrument_id', function(req, res) {
  var options = {
    url: 'https://api.robinhood.com/instruments/' + req.params.instrument_id,
    method: 'GET',
    headers: {
      "Authorization": "Token " + req.query.token
    }
  };
  proxyRequest(options, res);
});

server.get('/quotes', function (req, res) {
  var options = {
    url: 'https://api.robinhood.com/quotes/',
    method: 'GET',
    qs: {
      symbols: req.query.symbols
    },
    headers: {
      "Authorization": "Token " + req.query.token
    }
  };
  proxyRequest(options, res);
});

var port = process.env.PORT || 3000
server.listen(port, function () {
  console.log('App listening on port ' + port);
});
