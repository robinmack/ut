var userService = require("../services/orders");
module.exports = {
    getNewOrders: function(req, res, next) {
        if (req.session.role == 0){
            userService.parseFile(function(data, err){
                //TODO: report num of new orders, num of ribbons, num of medals
                if (!!data) {
                    let motd = "Successfully processed orders."
                    res.render('main', {appTitle:"Processed Orders", motd: motd});
                } else {
                    next(err);
                }
            });
        } else {
            return next("Only administrators can perform this action");
        }
    }
}