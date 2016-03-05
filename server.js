var fs = require("fs");
var browserify = require("browserify");
var babelify = require("babelify");
let express = require('express');
let sassMiddleware = require('node-sass-middleware');
let path = require('path');
let server = express();

browserify({ debug: true })
  .transform(babelify)
  .transform({global: true}, 'uglifyify')
  .require("src/app.js", { entry: true })
  .bundle()
  .on("error", function (err) { console.log("Error: " + err.message); })
  .pipe(fs.createWriteStream("public/javascripts/bundle.js"));

server.engine('html', require('ejs').renderFile);
server.use(express.static('public'));
server.use(express.static('bower_components'));
server.set('views', './')
server.use(sassMiddleware({
    /* Options */
    src: __dirname,
    dest: path.join(__dirname, 'public'),
    debug: true,
    outputStyle: 'compressed',
    prefix:  '/styles'  // Where prefix is at <link rel="stylesheets" href="prefix/style.css"/>
}));

server.get('/', function (req, res) {
  res.render('index.html');
});

let port = process.env.PORT || 3000;
server.listen(port, function () {
  console.log('Example app listening on port 3000!');
});
