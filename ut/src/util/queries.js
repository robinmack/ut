var promise = require('bluebird');
var bcrypt = require('bcrypt');
var options = {
  // Initialization Options
  promiseLib: promise
};

var pgp = require('pg-promise')(options);
var connectionString = 'postgres://localhost:5432/ut';
var db = pgp(connectionString);
var salt = "ut4all2017";

// add query functions

module.exports = {
  getAllUsers: getAllUsers,
  getSingleUser: getSingleUser,
  createUser: createUser,
  updateUser: updateUser,
  removeUser: removeUser,
  authenticateUser: authenticateUser
};

function getAllUsers(req, res, next) {
    db.any('select * from users')
    .then(function (data) {
        res.status(200)
            .json({
                status: 'success',
                data: data,
                message: 'retrieved all users'
            })
    })
    .catch(function (err) {
        return next(err);
    });
} 

function getSingleUser(req, res, next) {
    var userId = parseInt(req.params.id);
    db.one('SELECT * FROM users WHERE id = $1', userId)
    .then(function (data){
        res.status(200)
        .json({
            status: 'success',
            data: data,
            message: 'retrieved single user'
        });
    })
    .catch(function (err) {
        return next(err);
    });
}

function authenticateUser(req, res, next) {
    var username = req.params.username;
    var password = req.params.password;
    var session = req.session;

    db.one('SELECT * FROM users WHERE USERNAME = $1', username)
    .then(function(data){
        password=encryptField(password);
        if (password = data.password) {
            session.username = data.username;
            session.email = data.email;
            session.role = data.role;
            res.session = session;
            res.redirect("/main");
        } else {
            res.render("views/index.html");
        }
    }) .catch(function (err) {
        return next(err);
    });
}

function createUser(req, res, next){
    req.body.role = parseInt(req.body.role);
    req.body.password = encryptField(req.body.password);
    db.none('insert into users (username, password, email, role)' +
        'values(${username}, ${password}, ${email}, ${role}', req.body)
    .then(function(){
        req.status(200)
            .json({
                status: 'success',
                message: 'inserted user record'
            });
    })
    .catch(function (err){
        return next(err);
    })
}

function updateUser(req, res, next){
    req.body.id = parseInt(req.body.id);
    req.body.role = parseInt(req.body.role);

    if (req.body.password.length > 0){
        db.none('UPDATE users SET username=$1, email=$2, role=$3 WHERE id=$4',
            [req.body.username, req.body.email, req.body.role, req.body.id])
        .then(function() {
            req.status(200)
            .json({
                status: 'success',
                message: 'updated user'
            })
        })
        .catch(function(err){
            return next(err);
        });
    } else {
        req.body.password = encryptField(req.body.password);
        db.none('UPDATE users SET username=$1, email=$2, role=$3, password=$4 WHERE id=$5',
            [req.body.username, req.body.email, req.body.role, req.body.password, req.body.id])
        .then(function() {
            req.status(200)
            .json({
                status: 'success',
                message: 'updated user'
            })
        })
        .catch(function(err){
            return next(err);
        });
    }
}

function removeUser(req, res, next) {
    req.body.id = parseInt(req.body.id);
    db.result('DELETE FROM users WHERE id = $1',req.body.id)
    .then(function(){
        res.status('200')
        .json({
            status: "success",
            message: "deleted user"
        })
    })
    .catch(function(err){
        return next(err);
    })
}

function encryptField(val) {
    var encVal = bcrypt.hash(val, salt, function(err, hash){
        if (!err) {
            return (hash);
        }
    });
    return encVal;
}