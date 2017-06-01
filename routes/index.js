var express = require('express');
var router = express.Router();
//app.set("views", __dirname + "/src/views");
var usersController = require('../src/controllers/users');

/* GET home page. */
router.get('/', function(req, res) {
  if (!! req.session.role){
    res.redirect('/main');
  } else {
    res.render('index', { appTitle: 'UltraThin CRM' });
  }
});
router.get('/main', function(req, res){
  res.render('main', {appTitle: 'UltraThin CRM'});
})


// users controller routes
router.get('/api/users',usersController.getAllUsers);
router.post('/api/login', usersController.authenticateUser);
router.get('/api/users/:id', usersController.getSingleUser);
router.post('/api/users', usersController.createUser);
router.put('/api/users/:id',usersController.updateUser);
router.delete('/api/users/:id', usersController.removeUser);
router.get('/users/list', usersController.viewUsers);
router.get('/users/edit/:id', usersController.editUser);
router.get('/users/new', usersController.newUser);
module.exports = router;
