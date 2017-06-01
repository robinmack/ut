var express = require('express');
var router = express.Router();
var usersController = require('../src/controllers/users');
var ordersController = require('../src/controllers/orders')
var customersController = require('../src/controllers/customers');

/* GET index/main (depending on session) */
router.get('/', function(req, res) {
  if (!! req.session.role){
    res.redirect('/main');
  } else {
    res.render('index', { appTitle: '' });
  }
});
router.get('/main', function(req, res){
  res.render('main', {appTitle: ''});
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

// orders routes
router.get('/api/orders/new', ordersController.getNewOrders);

// customer routes
router.get('/customer/find', function(req, res){
  res.render('customerFind');
});
router.post('/customers/find', customersController.find);
router.get('/customers/edit/:id', customersController.edit);
router.get('/customers/new/:id', customersController.new);
module.exports = router;
