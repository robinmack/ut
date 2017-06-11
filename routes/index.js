const express = require('express'),
    usersController = require('../src/controllers/users'),
    ordersController = require('../src/controllers/orders'),
    customersController = require('../src/controllers/customers'),
    mainController = require('../src/controllers/main');
let router = express.Router();

/* GET index/main (depending on session) */
router.get('/', function(req, res) {
    if (!! req.session.role){
        res.redirect('/main');
    } else {
        res.render('index', { appTitle: 'Login', role: req.session.role });
    }
});

// main controller routes
router.get('/main', mainController.motd);
router.get('/main/logout', function(req, res){
    req.session.destroy();
    res.redirect("/");
});
router.get('/main/changePassword', function (req, res) {
    res.render('changePassword',{ appTitle: 'Change Password', role: req.session.role });
});
router.post('/main/changePassword', mainController.updatePassword);
router.get('/main/switchRole', function(req, res){
    res.render('switchRole',{ appTitle: 'Switch Role', successMsg: "Successfully changed roles", role: req.session.role });
});
router.post('/main/switchRole', function(req, res){
    req.session.role=req.body.role;
    res.redirect('/main');
});

// usersController controller routes
router.get('/api/users',usersController.getAllUsers);
router.get('/api/users/:id', usersController.getSingleUser);
router.post('/api/users', usersController.createUser);
router.put('/api/users/:id',usersController.updateUser);
router.delete('/api/users/:id', usersController.removeUser);
router.post('/api/login', usersController.authenticateUser);
router.get('/users/list', usersController.viewUsers);
router.get('/users/edit/:id', usersController.editUser);
router.get('/users/new', usersController.newUser);

// ordersController routes
router.get('/api/orders/process', ordersController.getNewOrders);
router.get('/orders/find', function(req, res){
    res.render('orderFind',{appTitle: "Find Order", role: req.session.role});
});
router.get('/orders/edit/:id', ordersController.edit);
router.post('/orders/find', ordersController.find);

// customersController routes
router.get('/customers/find', function(req, res){
    res.render('customerFind',{appTitle:"Find Customer", role: req.session.role});
});
router.post('/customers/find', customersController.find);
router.get('/customers/edit/:id', customersController.edit);
router.get('/customers/new/', customersController.new);
router.post('/api/customers/', customersController.createCustomer);
router.put('/api/customers/:id', customersController.updateCustomer)
module.exports = router;
