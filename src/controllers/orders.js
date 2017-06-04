var userService = require("../services/orders");
var dbUtil = require("../util/dbQueries.js");
module.exports = {
    getNewOrders: function(req, res, next) {
        if (req.session.role == 0){
            userService.parseFile(function(data, err){
                //TODO: report num of new orders, num of ribbons, num of medals
                if (!!data) {
                    let motd = "Successfully processed orders."
                    res.render('main', {appTitle:"Processed Orders", motd: motd, loggedIn: true});
                } else {
                    next(err);
                }
            });
        } else {
            return next("Only administrators can perform this action");
        }
    },
        find: function(req, res, next){
        if (req.session.role < 3 && req.session.role > -1){
            let customerOrder = {
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                phone: req.body.phone
            }
            dbUtil.findOrder(customerOrder, function (data, err){
                if(err){
                    next (err);
                } else {
                    if (data.length == 0){
                    data=[{firstname:"N/A",lastname:"None Found",email:"N/A",date:"N/A",city:"N/A", state:"N/A", totalGrand:"N/A"}];
                    }
                    res.render('orderFind', {appTitle:"Find Order", loggedIn: true, customerOrder: data});
                }
            });
        } else {
            return next("Your account does not have privileges to perform this action");
        }
    }

}