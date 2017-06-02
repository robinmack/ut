var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var app = express();
var router = express.Router();
var db = require('./src/util/queries');
app.set('view engine', 'pug')
app.set("views", __dirname + "/src/views");
app.use(session(
    {secret: "SqueamishOssifrage!",
     name: 'ut-internal',
     proxy: false,
     resave: true,
     saveUninitialized: false
    }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
// print stacktrace to dev
if (app.get('env') === 'development') {
  app.use(function(err, req, res) {
    res.status( err.code || 500 )
    .json({
      status: 'error',
      message: err
    });
  });
}

// production error handler
app.use(function(err, req, res) {
  res.status(err.status || 500)
  .json({
    status: 'error',
    message: err.message
  });
});

var session;

router.get('/', function(req,res){
    if(session.username) {
        res.redirect('/main');
    } else {
        res.render('index.html');
    }
});

router.get('/api/users', db.getAllUsers);
router.post('/api/login', db.authenticateUser);
router.get('/api/users/:id', db.getSingleUser);
router.post('/api/users', db.createUser);
router.put('/api/users/:id', db.updateUser);
router.delete('/api/users/:id', db.removeUser);

module.exports = router;