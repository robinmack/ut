user = require('/src/data/user');
dbutil = require('/src/util/dbutil');

module.exports = {
    id = -1,
    username = "",
    encPassword = "",
    password,
    email = "",
    role = -1,

    authenticateUser: function(username, password) {
        user = new user();
        user.username = username;
        user.password = password;
        return dbutil.authenticateUser(this.sanitizeUser(user));
    },

    validate: function() {
        if ((this.username.length > 0) &&
        (this.password.length > 0) &&
        (this.email.length > 0) && 
        (this.role > 0)) {
            return true;
        }
        return false;
    },

    insertUser: function(user){
        dbutil.insertUser(sanitizeUser(user));
    },

    updateUser: function(user){
        return dbutil.updateUser(sanitizeUser(user));
    },

    sanitizeUser: function(user) {
       user.username = dbutil.sanitizeField(user.username);
       user.password = dbutil.sanitizeField(user.password);
       user.email = dbutil.sanitizeField(user.email);
    }
}