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
  sanitizeField: sanitizeField,
  upsertCustomer: upsertCustomer,
  findCustomer: findCustomer,
  getSingleCustomer: getSingleCustomer,
  createCustomer, createCustomer,
  updateCustomer, updateCustomer
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
            res.render("index",{appTitle: "Log In", loggedIn: false});
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

function upsertCustomer(customer, callback){
    db.result('INSERT INTO customer (lastname, firstname, addr1, addr2, city, state, zip, phone, email, service, gender) ' +
    'VALUES (${firstname}, ${lastname}, ${addr1}, ${addr2}, ${city}, ${state}, ${zip}, ${phone}, ${email}, ${service}, ${gender}) ' +
    'ON CONFLICT ON CONSTRAINT unique_email_addr DO UPDATE SET lastname=excluded.lastname, firstname=excluded.firstname, addr1=excluded.addr1, addr2=excluded.addr2, city=excluded.city, state=excluded.state, zip=excluded.zip, email=excluded.email, phone = excluded.phone, service = excluded.service, gender=excluded.gender ' +
    'RETURNING id', customer)
    .then(function(data){
        callback(data.id);
    })
    .catch(function(error){
        console.log(error);
    });
};

function findCustomer(customerQuery, callback){
    let query = "SELECT id, firstname, lastname, email, phone, service, city, state FROM customer WHERE ";
    let useAnd = false;
    if (!!customerQuery.firstname){
        query += useAnd ? "AND ": "";
        query += setQueryField("firstname", customerQuery.firstname);
        useAnd = true;
    }
    if (!!customerQuery.lastname){
        query += useAnd ? "AND ": "";
        query += setQueryField("lastname", customerQuery.lastname);
        useAnd = true;
    }
    if (!!customerQuery.email){
        query += useAnd ? "AND ": "";
        query += setQueryField("email", customerQuery.email);
        useAnd = true;
    }
    if (!!customerQuery.phone){
        query += useAnd ? "AND ": "";
        query += setQueryField("phone", customerQuery.phone);
        useAnd = true;
    }
    query += "ORDER BY lastname ASC, firstname ASC"
    db.any(query, callback)
    .then(function(data){
        callback(data);
    })
    .catch(function(error){
        console.log(error);
    });

}
function setQueryField(fieldName, value){
       return fieldName + " LIKE " + fixWildcards(value);
}
function fixWildcards(val){
    return "'" + val.replace("*", "%") + "'";
}

function getSingleCustomer(customerId, callback) {
    db.one('SELECT * FROM customer WHERE id = $1', customerId)
    .then(function (data){
        callback(data,null);
    })
    .catch(function (err) {
        callback(null, err);
    });
}

function createCustomer(customer, callback){
    db.none('INSERT INTO customer(firstname, lastname, addr1, addr2, city, state, zip, email, phone, service, gender) ' +
        'VALUES (${firstname}, ${lastname}, ${addr1}, ${addr2}, ${city}, ${state}, ${zip}, ${email}, ${phone}, ${service}, ${gender})', customer)
    .then(function(){
        callback(null);
    })
    .catch(function (err){
        callback(err);
    })
}

function updateCustomer(customer, callback){
    customer.id = parseInt(customer.id);
    db.none('UPDATE customer SET firstname=${firstname}, lastname=${lastname}, addr1=${addr1}, addr2=${addr2}, city=${city}, state=${state}, zip=${zip}, email=${email}, phone=${phone}, service=${service}, gender=${gender} '+
        'WHERE id=${id}', customer)
    .then(function(){
        callback(null);
    })
    .catch(function(err){
        callback(err);
    })
}
