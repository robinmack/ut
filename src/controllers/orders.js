var userService = require("../services/orders");
module.exports = {
    getNewOrders: function(req, res, next) {
        if (req.session.role == 0){
            userService.parseFile(function(data, err){
                if (!!data) {
                    res.redirect('/main');
                } else {
                    next(err);
                }
            });
        } else {
            return next("Only administrators can perform this action");
        }
    }
}