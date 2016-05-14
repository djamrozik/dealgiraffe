
var express        = require('express'),
    bodyParser     = require('body-parser'),
    HomeController = require('./server/controllers/HomeController'),
    local_codes    = require('./local_codes'),
    passport       = require('passport'),
    LocalStrategy  = require('passport-local').Strategy,
    mongoose       = require('mongoose'),
    expressSession = require('express-session'),
    bCrypt         = require('bcrypt-nodejs'),
    DealController = require('./server/controllers/DealController')
    app = express();


// open server for listening
var server = app.listen(local_codes.port_site, local_codes.internal_ip, function(){
    var host = server.address().address;
    var port = server.address().port;
    console.log('App listening at http://%s:%s', host, port);
});

//middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(expressSession({
  secret: 'mySecretKey',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// Using the flash middleware provided by connect-flash to store messages in session
// and displaying in templates
var flash = require('connect-flash');
app.use(flash());

app.use('/client', express.static(__dirname + '/client'));

// Initialize Passport
var initPassport = require('./server/passport/init');
initPassport(passport);

//routing (will be moved to it's own file later)
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/client/index.html');
});

app.get('/adminlogin', function(req, res){
  res.sendFile(__dirname + '/client/app/views/adminlogin.html');
});

app.post('/api/sendmessage', HomeController.send);

/* Handle Login POST */
app.post('/login', passport.authenticate('login', {
  successRedirect: '/admin',
  failureRedirect: '/',
  failureFlash : true 
}));

app.get('/loginFailure', function(req, res, next) {
  res.send('Failed to authenticate');
});

app.get('/loginSuccess', function(req, res, next) {
  res.send('Successfully authenticated');
});

// As with any middleware it is quintessential to call next()
// if the user is authenticated
var isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/');
}

// app.get('/admin', isAuthenticated, function(req, res){
//   res.sendFile(__dirname + '/client/app/views/admin.html');
// });

// get rid of the isAuthenticated for now
app.get('/admin', function(req, res){
    res.sendFile(__dirname + '/client/app/views/admin.html');
});

app.get('/admin/ViewAllItems', function(req, res){
    res.sendFile(__dirname + '/client/app/views/admin_view_all_items.html');
});

app.post('/api/deal', isAuthenticated, DealController.addDeal);
 
app.get('/api/deal', DealController.getAllDeals);

app.get('/api/getinfo/:id', DealController.getProductInfo);

app.delete('/api/deal/:id', isAuthenticated, DealController.removeDeal);