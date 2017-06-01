let dbUtil = require("../util/dbQueries");
module.exports = {
    find: function(req, res, next){
        if (req.session.role < 3 && req.session.role > -1){
            let customer = {
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                phone: req.body.phone
            }
            dbUtil.findCustomer(customer, function (data, err){
                if(err){
                    next (err);
                } else {
                    if (data.length == 0){
                    data=[{firstname:"None Found",lastname:"N/A",email:"N/A",phone:"N/A",city:"N/A", state:"N/A"}];
                    }
                    res.render('customerFind', {appTitle:"Find Customer", customers: data});
                }
            });
        } else {
            return next("Your account does not have privileges to perform this action");
        }
    },

    edit: function(req, res, next){
        if (req.session.role < 3 && req.session.role > -1){
            let customerId = parseInt(req.params.id);
            dbUtil.getSingleCustomer(customerId, function (data, err){
                if(err){
                    next (err);
                } else {
                    res.render('customerView', {appTitle:"Edit Customer", method:"PUT", action:"/api/users/" + customerId, buttonText: "Submit Changes", customer: data});
                }
            });
        } else {
            return next("Your account does not have privileges to perform this action");
        }
    },

    new: function(req, res, next){
        if (req.session.role < 3 && req.session.role > -1){
            let customerId = parseInt(req.params.id);
            dbUtil.getSingleCustomer(customerId, function (data, err){
                if(err){
                    next (err);
                } else {
                    res.render('customerView', {appTitle:"New Customer", method:"POST", action:"/api/users/", buttonText: "Create User"});
                }
            });
        } else {
            return next("Your account does not have privileges to perform this action");
        }
    },

    createCustomer: function(req,res,next) {
        if (req.session.role < 3 && req.session.role > -1){
            for(let property in req.body){
                property = dbUtil.sanitizeField(property);
            }
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
            }

            dbUtil.createCustomer(customer, function(err){
                if (!!!err) {
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
        if (req.session.role < 3 && req.session.role > -1){
            for(let property in req.body){
                property = dbUtil.sanitizeField(property);
            }
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
            }
            dbUtil.updateCustomer(customer, function(customer, err){
                if (!!!err) {
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

}