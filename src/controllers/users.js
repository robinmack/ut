var db = require("../util/dbQueries");
module.exports = {
    getAllUsers: function(req, res, next) {
        if (req.session.role == 0){
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
        if (req.session.role == 0){
            var userId = parseInt(req.params.id);
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
        if (req.session.role == 0){
            for(let property in req.body){
                property = db.sanitizeField(property);
            }
            let user = {
                username: req.body.username,
                password: req.body.password,
                role: req.body.role,
                email: req.body.email
            }

            db.createUser(user, function(err){
                if (!!!err) {
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
        if (req.session.role == 0){
            for(let property in req.body){
                property = db.sanitizeField(property);
            }
            let user = {
                username: req.body.username,
                password: req.body.password,
                role: req.body.role,
                email: req.body.email,
                id: req.body.id
            };
            db.updateUser(user, function(user, err){
                if (!!!err) {
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
        if (req.session.role == 0){
            let id = req.params.id;
            db.removeUser(id, function(err){
                if (!!!err) {
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

    authenticateUser: function(req, res, next){
        for(var property in req.body){
            property = db.sanitizeField(property);
        }
        db.authenticateUser(req, res, next);    
    },

    viewUsers: function(req, res, next){
        if (req.session.role == 0){
            db.getAllUsers(function(data, err){
                if (!!data) {
                    if(data.length == 0){
                        data=[{username:"no users found", email:"n/a", role:"n/a"}];
                    }

                    res.render("users",{appName:"List Users", users:data});
                } else {
                    next(err);
                }
            });
        } else {
            return next("Only administrators can perform this action");
        }
    },

    editUser: function(req, res, next){
        let id = parseInt(req.params.id);
        if (req.session.role == 0){
            db.getSingleUser(id,function(data, err){
                if (!!data) {
                    if(data.length == 0){
                        data={username:"", email:"", role:"", password:""};
                    } else {
                        data.password = "";
                    }
                    res.render("userView",{appName:"Edit User", method:"PUT", action:"/api/users/" + id, appTitle:"Edit User", user:data, buttonText:"Submit Changes"});
                } else {
                    next(err);
                }
            });
        } else {
            return next("Only administrators can perform this action");
        }
    },

    newUser: function(req, res, next){
        if (req.session.role == 0){
            res.render("userView",{appName:"New User", method:"POST", action:"/api/users/", buttonText:"Create User"});
        } else {
            return next("Only administrators can perform this action");
        }
    }
};