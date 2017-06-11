const bcrypt = require('bcrypt'),
    db = require('../util/dbUtil');

// add query functions
module.exports = {
    getAllUsers: getAllUsers,
    getSingleUser: getSingleUser,
    createUser: createUser,
    updateUser: updateUser,
    removeUser: removeUser,
    authenticateUser: authenticateUser,
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

function authenticateUser(username, password) {
    return new Promise(function(resolve, reject ) {
        db.one("SELECT * FROM users WHERE USERNAME = $1", username)
            .then(function (data) {
                if (bcrypt.compareSync(password, data.password)) {
                    resolve(data);
                } else {
                    reject("Username/Password not found.  Please try again or contact an administrator");
                }
            })
            .catch((err)=> {
                reject(err);
            });
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

    if (user.password.length === 0){
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

function encryptField(val) {
    return bcrypt.hashSync(val, bcrypt.genSaltSync());
}