var bcrypt = require("bcrypt");
var salt = "ut4all2017"
module.exports = {
    authenticateUser: function (user) {
        if (user.username.length == 0 || 
        user.password.length == 0) {
            return false;
        }
        authUser = this.getUser(user.username);
        if (!!authUser){
            user.encPassword = this.encryptField(user.password);
            if (user.encPassword === authUser.encPassword)
            {
                return true;
            }
        }
        return false;
    },

    dbConnect: function () {
        var conString = process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/postgres";
        var client = new pg.Client(conString);

        client.connect();
        return client;
    },

    insertUser: function(sanitizedUser) {
        var client = this.dbConnect();
        client.query({
            name: 'insert user',
            text: "INSERT INTO users (username, password, email, role) VALUES($1,$2,$3,$4)",
            values: [user.username, this.encryptField(user.password),user.email,user.role]
        });
    },

    getUser: function(username) {
        username = sanitizeField(username);
        var sql = "GET * FROM users WHERE username = '" + username + "'";
        var connection = this.dbConnect();
        connection.query(sql);
        var user = new user();
        query.on('row', function(row){
            user.username = row.username;
            user.encPassword = row.password;
            user.email = row.email;
            user.role = row.role;
        });
    },
    
    updateUser: function() {
        
    },
    sanitizeField: function(val) {
        return val.replace(/-{2,}/g, "-")
                .replace(/\s+(exec|execute|select|insert|update|delete|alter|drop|truncate)/g, "");
    },
    encryptField: function(val) {
        var encVal = bcrypt.hash(val, salt, function(err, hash){
            if (!err) {
                return (hash);
            }
        });
        return encVal;
    }
}