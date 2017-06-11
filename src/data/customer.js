const db = require("../util/dbUtil");

module.exports = {
    findCustomer: findCustomer,
    getSingleCustomer: getSingleCustomer,
    createCustomer: createCustomer,
    updateCustomer: updateCustomer
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
    }
    query += "ORDER BY lastname ASC, firstname ASC";
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
    return "'" + val.replace(/\*/g, "%") + "'";
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
        });
}