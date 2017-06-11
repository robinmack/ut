let fs = require('fs'),
    dbUtil = require('../util/dbQueries');
module.exports = {
    motd: function(req, res){
        let motd=fs.readFileSync('public/motd.txt').toString()
        res.render('main', {appTitle: 'MOTD', role: req.session.role, motd: motd});
    },
    updatePassword: function(req, res, next){
        let oldPassword = req.body.oldPassword;
        if (req.body.newPassword !== req.body.confirmPassword){
            res.render("changePassword", {
                appTitle:"Change Password",
                role: req.session.role,
                errorMsg: "New Password and Confirm Password do not match"
            })
        }
        let userName = req.session.username;
        dbUtil.authenticateUser(userName, oldPassword)
            .then(function (user) {
                    user.password = req.body.newPassword;
                    dbUtil.updateUser(user, function(data, err) {
                        if (!!!err) {
                            res.render("changePassword", {
                                appTitle: "Change Password",
                                successMsg: "Successfully updated password",
                                role: req.session.role
                            });
                        } else {
                            res.render("changePassword", {
                                appTitle: "Change Password",
                                errorMsg: "Could not update password.  Error was: " + err,
                                role: req.session.role
                            });
                        }
                    });

            })
            .catch(function(err){
                res.render("changePassword", {
                    appTitle: "Change Password",
                    errorMsg: "Could not update password.  Error was: " + err,
                    role: req.session.role
                });
            });
    }
}