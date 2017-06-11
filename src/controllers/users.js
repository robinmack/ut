let db = require("../util/dbQueries");
module.exports = {
    getAllUsers: function(req, res, next) {
        if (req.session.role === 0){
            db.getAllUsers(function(data, err){
                if (!!data) {
                    res.status(200)
                    .json({
                        status: 'success',
                        data: data,
                        message: 'retrieved all users'
                    });
                } else {
                    next(err);
                }
            });
        } else {
            return next("Only administrators can perform this action");
        }
    },
    
    getSingleUser: function(req,res,next) {
        if (req.session.role === 0){
            const userId = parseInt(req.params.id);
            db.getSingleUser(userId, function(data, err){
                if (!!data) {
                    res.status(200)
                    .json({
                        status: 'success',
                        data: data,
                        message: 'retrieved single user'
                    });
                } else {
                    next(err);
                }
            });
        } else {
            return next("Only administrators can perform this action");
        }
    },

    createUser: function(req,res,next) {
        if (req.session.role === 0){
            let user = {
                username: req.body.username,
                password: req.body.password,
                role: req.body.role,
                email: req.body.email
            };

            db.createUser(user, function(err){
                if (!err) {
                    res.status(200)
                    .json({
                        status: 'success',
                        message: 'created user'
                    });
                } else {
                    next(err);
                }
            });
        } else {
            return next("Only administrators can perform this action");
        }
    },

    updateUser: function(req,res,next) {
        if (req.session.role === 0){
            const user = {
                username: req.body.username,
                password: req.body.password,
                role: req.body.role,
                email: req.body.email,
                id: req.body.id
            };
            db.updateUser(user, function(user, err){
                if (!err) {
                    res.status(200)
                    .json({
                        status: 'success',
                        message: 'Successfully updated user.'
                    });
                } else {
                    next(err);
                }
            });
        } else {
            return next("Only administrators can perform this action");
        }
    },

    removeUser: function(req,res,next) {
        if (req.session.role === 0){
            const id = req.params.id;
            db.removeUser(id, function(err){
                if (!err) {
                    res.status(200)
                    .json({
                        status: 'success',
                        message: 'Successfully removed user.'
                    });
                } else {
                    next(err);
                }
            });
        } else {
            return next("Only administrators can perform this action");
        }
    },

    authenticateUser: function(req, res){
        db.authenticateUser(req.body.username, req.body.password).then(
            function(data) {
                if(!! data) {
                    req.session.role = data.role;
                    req.session.username = data.username;
                    req.session.userId = data.userId;
                    req.session.email = data.email;
                    res.redirect("/main");
                }
            }
        )
        .catch(function(err){
            res.render('index', {appTitle:'Login', errorMsg: err});
        });
    },

    viewUsers: function(req, res, next){
        if (req.session.role === 0){
            db.getAllUsers(function(data, err){
                if (!!data) {
                    if(data.length === 0){
                        data=[{username:"No users found", email:"n/a", role:"n/a"}];
                    }

                    res.render("users",{appTitle:"List Users", role: req.session.role, users:data});
                } else {
                    next(err);
                }
            });
        } else {
            return next("Only administrators can perform this action");
        }
    },

    editUser: function(req, res, next){
        const id = parseInt(req.params.id);
        if (req.session.role === 0){
            db.getSingleUser(id,function(data, err){
                if (!!data) {
                    if(data.length === 0){
                        data={username:"", email:"", role:"", password:""};
                    } else {
                        data.password = "";
                    }
                    res.render("userView",{appTitle:"Edit User", role: req.session.role, method:"PUT", action:"/api/users/" + id, appTitle:"Edit User", user:data, buttonText:"Submit Changes"});
                } else {
                    next(err);
                }
            });
        } else {
            return next("Only administrators can perform this action");
        }
    },

    newUser: function(req, res, next){
        if (req.session.role === 0){
            res.render("userView",{appTitle:"New User", role: req.session.role, method:"POST", action:"/api/users/", buttonText:"Create User"});
        } else {
            return next("Only administrators can perform this action");
        }
    }
};