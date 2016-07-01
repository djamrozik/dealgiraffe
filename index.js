
// global resources 
var express        = require('express');
var mongoose       = require('mongoose');
var bodyParser     = require('body-parser');
var passport       = require('passport');
var expressSession = require('express-session');
var flash          = require('connect-flash');
var handlebars     = require('express-handlebars');

// local resources
var local_codes    = require('./local_codes');
var initPassport   = require('./server/passport/init');
var app            = express();

// open server for listening
var server = app.listen(local_codes.port_site, local_codes.internal_ip, function(){
    var host = server.address().address;
    var port = server.address().port;
    console.log('DealGiraffe listening at http://%s:%s', host, port);
});

// connect to mongodb
mongoose.connect('mongodb://localhost/DealGiraffe');

// Serve hot-reloading bundle to client with webpack hot loading
if (process.env.NODE_ENV === 'development') {
    var webpack = require('webpack');
    var config = require('./webpack.config');
    var compiler = webpack(config);
    app.use(require("webpack-dev-middleware")(compiler, {
        noInfo: false, publicPath: config.output.publicPath, hot: true
    }));
    app.use(require("webpack-hot-middleware")(compiler));
}

// middleware - json responses
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// middleware - passport
app.use(expressSession({
    secret: 'mySecretKey',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// Using the flash middleware provided by connect-flash to store messages in session and displaying in templates
app.use(flash());

// static files
app.use('/client', express.static(__dirname + '/client'));
app.use(express.static(__dirname + '/client'));

// handlebar engine
app.engine('handlebars', handlebars({defaultLayout: 'product_page'}));
app.set('view engine', 'handlebars');

// Initialize Passport
initPassport(passport);

// routing (needs to be after middleware)
require('./server/routes/admin')(app);
require('./server/routes/pages')(app);
require('./server/routes/productItem')(app);
require('./server/routes/queryItem')(app);
