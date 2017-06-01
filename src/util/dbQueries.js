var promise = require('promise');
var bcrypt = require('bcrypt');
var options = {
  // Initialization Options
  promiseLib: promise
};
var cn = {
    host: 'localhost',
    port: 5432,
    database: 'ut',
    user: 'postgres',
    password: '4nubis!'
};
var pgp = require('pg-promise')(options);
var db = pgp(cn);

// add query functions

module.exports = {
  getAllUsers: getAllUsers,
  getSingleUser: getSingleUser,
  createUser: createUser,
  updateUser: updateUser,
  removeUser: removeUser,
  authenticateUser: authenticateUser,
  sanitizeField: sanitizeField
};

function getAllUsers(callback) {
    db.any('select * from users')
    .then(function(data){
        callback(data, null);
    })
    .catch(function (err) {
        callback(null, err);
    });
} 

function getSingleUser(userId, callback) {
    db.one('SELECT * FROM users WHERE id = $1', userId)
    .then(function (data){
        callback(data,null);
    })
    .catch(function (err) {
        callback(null, err);
    });
}

function authenticateUser(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    var session = req.session;

    db.one("SELECT * FROM users WHERE USERNAME = '" + username + "'")
    .then(function(data){
        
        if (bcrypt.compareSync(password,data.password)) {
            session.username = data.username;
            session.email = data.email;
            session.role = data.role;
            res.session = session;
            res.redirect("/main");
        } else {
            res.render("index");
        }
    }) .catch(function (err) {
        return next(err);
    });
}

function createUser(user, callback){
    user.role = parseInt(user.role);
    user.password = encryptField(user.password);
    db.none('INSERT INTO users(username, password, email, role) ' +
        'VALUES (${username}, ${password}, ${email}, ${role})', user)
    .then(function(){
        callback(null);
    })
    .catch(function (err){
        callback(err);
    })
}

function updateUser(user, callback){
    user.id = parseInt(user.id);
    user.role = parseInt(user.role);

    if (user.password.length == 0){
        db.none('UPDATE users SET username=$1, email=$2, role=$3 WHERE id=$4',
            [user.username, user.email, user.role, user.id])
        .then(function() {
            callback(null);
        })
        .catch(function(err){
            callback(err);
        });
    } else {
        user.password = encryptField(user.password);
        db.none('UPDATE users SET username=$1, email=$2, role=$3, password=$4 WHERE id=$5',
            [user.username, user.email, user.role, user.password, user.id])
        .then(function() {
            callback(null);
        })
        .catch(function(err){
            callback(err);
        });
    }
}

function removeUser(id, callback) {
    id = parseInt(id);
    db.result('DELETE FROM users WHERE id = $1', id)
    .then(function(){
        callback(null);
    })
    .catch(function(err){
        callback(err);
    })
}

function sanitizeField(val) {
    return val.replace(/-{2,}/g, "-")
            .replace(/\s+(exec|execute|select|insert|update|delete|alter|drop|truncate)/g, "");
}

function encryptField(val) {
    return bcrypt.hashSync(val, bcrypt.genSaltSync());
}