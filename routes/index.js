let express = require('express'),
router = express.Router(),
usersController = require('../src/controllers/users'),
ordersController = require('../src/controllers/orders'),
customersController = require('../src/controllers/customers'),
mainController = require('../src/controllers/main');

/* GET index/main (depending on session) */
router.get('/', function(req, res) {
  if (!! req.session.role){
    res.redirect('/main');
  } else {
    res.render('index', { appTitle: '', loggedIn: false });
  }
});
router.get('/main', mainController.motd);
router.get('/main/logout', function(req, res){
  req.session.destroy();
  res.redirect("/")
});

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
router.get('/customers/find', function(req, res){
  res.render('customerFind');
});
router.post('/customers/find', customersController.find);
router.get('/customers/edit/:id', customersController.edit);
router.get('/customers/new/', customersController.new);
router.post('/api/customers/', customersController.createCustomer);
router.put('/api/customers/:id', customersController.updateCustomer)
module.exports = router;
