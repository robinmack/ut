var orderService = require("../services/orders");
var dbUtil = require("../util/dbQueries.js");
Promise = require('promise'),
module.exports = {
    getNewOrders: function(req, res, next) {
        //if (req.session.role == 0){
            console.log("in getNewOrders");
            orderService.processFile()
                .then((data)=>function(data){
                    let motd = "Successfully processed: " + data.numOrders + " orders, " + data.numberRibbons + " ribbons, " +
                        data.numberMiniMedalSets + " mini medal sets, " + data.numberLargeMedalSets + " large medal sets, " +
                        data.numberMagnetic + "magnetics, and $" + data.totalGrand + "in orders.";
                    res.render('main', {appTitle:"Processed Orders", motd: motd, loggedIn: true});
                })
                .catch((err)=>next(err));
    },
        find: function(req, res, next){
        if (req.session.role < 3 && req.session.role > -1){
            let customerOrder = {
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                city: req.body.city,
                state: req.body.state,
                branch: req.body.branch,
                date: req.body.date
            }
            dbUtil.findOrder(customerOrder, function (data, err){
                if(err){
                    next (err);
                } else {
                    if (data.rows.length == 0){
                    data=[{firstname:"N/A",lastname:"None Found",email:"N/A",date:"N/A",city:"N/A", state:"N/A", totalGrand:"N/A"}];
                    }
                    res.render('orderFind', {appTitle:"Find Order", loggedIn: true, customerOrder: data.rows});
                }
            });
        } else {
            return next("Your account does not have privileges to perform this action");
        }
    }

}