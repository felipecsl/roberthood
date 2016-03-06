let livereload = require('express-livereload')
let fs = require("fs");
let browserify = require("browserify");
let babelify = require("babelify");
let express = require('express');
let bodyParser = require('body-parser');
let path = require('path');
let request = require('request');
let server = express();

livereload(server, {})

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

server.get('/', function (req, res) {
  res.render('index.html');
});

server.post('/auth', function (req, res) {
  res.header("Content-Type", "application/json");
  res.status(200).send("{\"token\":\"foo\"}");
  // var options = {
  //   url: 'https://api.robinhood.com/api-token-auth/',
  //   form: req.body,
  //   headers: {
  //     'User-Agent': 'okhttp/3.2.0',
  //     'X-Robinhood-API-Version': '1.60.1'
  //   }
  // };
  // request.post(options, function (error, response, body) {
  //   res.header("Content-Type", "application/json");
  //   if (!error && response.statusCode == 200) {
  //     res.status(response.statusCode).send(body);
  //   } else {
  //     res.status(response.statusCode).send(error);
  //   }
  // });
});

var port = process.env.PORT || 3000
server.listen(port, function () {
  console.log('App listening on port ' + port);
});
