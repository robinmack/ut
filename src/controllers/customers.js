const dataCustomer = require("../data/customer.js"),
    dataOrder = require("../data/order.js");
module.exports = {
    find: function(req, res, next){
        if (parseInt(req.session.role) < 3 && parseInt(req.session.role) > -1){
            let customer = {
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                phone: req.body.phone
            };
            dataCustomer.findCustomer(customer, function (data, err){
                if(err){
                    next (err);
                } else {
                    if (data.length === 0){
                    data=[{firstname:"None Found",lastname:"N/A",email:"N/A",phone:"N/A",city:"N/A", state:"N/A"}];
                    }

                     res.render('customerFind', {appTitle:"Find Customer", role: req.session.role, customers: data});
                }
            });
        } else {
            return next("Your account does not have privileges to perform this action");
        }
    },

    edit: function(req, res, next){
        if (parseInt(req.session.role) < 3 && parseInt(req.session.role) > -1){
            let customerId = parseInt(req.params.id);
            dataCustomer.getSingleCustomer(customerId, function (data, err){
                if(err){
                    next (err);
                } else {
                    dataOrder.findOrder({customerId: customerId}, function(orderData) {
                        res.render('customerView', {
                            appTitle:"Edit Customer",
                            role: req.session.role,
                            method:"PUT",
                            action:"/api/customers/" + customerId,
                            buttonText: "Submit Changes",
                            customer: data,
                            customerOrders: orderData}
                        );
                    });
                }
            });
        } else {
            return next("Your account does not have privileges to perform this action");
        }
    },

    new: function(req, res, next){
        if (parseInt(req.session.role) < 3 && parseInt(req.session.role) > -1){
            res.render('customerView', {appTitle:"New Customer", role: req.session.role, method:"POST", action:"/api/customers/", buttonText: "Create User"});
        } else {
            return next("Your account does not have privileges to perform this action");
        }
    },

//api stuff here
    createCustomer: function(req,res,next) {
        if (parseInt(req.session.role) < 3 && parseInt(req.session.role) > -1){
            let customer = {
                lastname: req.body.lastname,
                firstname: req.body.firstname,
                addr1: req.body.addr1,
                addr2: req.body.addr2,
                city: req.body.city,
                state: req.body.state,
                zip: req.body.zip,
                phone: req.body.phone,
                email: req.body.email,
                service: req.body.service,
                gender: req.body.gender
            };

            dataCustomer.createCustomer(customer, function(err){
                if (!err) {
                    res.status(200)
                    .json({
                        status: 'success',
                        message: 'Created customer.'
                    });
                } else {
                    next(err);
                }
            });
        } else {
            return next("Your account does not have privileges to perform this action");
        }
    },

    updateCustomer: function(req,res,next) {
        if (parseInt(req.session.role) < 3 && parseInt(req.session.role) > -1){
            let customer = {
                id: req.params.id,
                lastname: req.body.lastname,
                firstname: req.body.firstname,
                addr1: req.body.addr1,
                addr2: req.body.addr2,
                city: req.body.city,
                state: req.body.state,
                zip: req.body.zip,
                phone: req.body.phone,
                email: req.body.email,
                service: req.body.service,
                gender: req.body.gender
            };
            dataCustomer.updateCustomer(customer, function(customer, err){
                if (!err) {
                    res.status(200)
                    .json({
                        status: 'success',
                        message: 'Successfully updated customer.'
                    });
                } else {
                    next(err);
                }
            });
        } else {
            return next("Your account does not have privileges to perform this action");
        }
    },

};