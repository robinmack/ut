const db = require("../util/dbUtil");

module.exports = {
    getAllPrices: getAllPrices,
    updatePrice: updatePrice
};


function getAllPrices() {
    return new Promise(function(resolve, reject){
        db.any('SELECT * FROM base_prices WHERE 1 = 1')
            .then(function (data){
                resolve(data);
            })
            .catch(function (err) {
                reject(err);
            });
    });
}

function updatePrice(price, callback){
    customer.id = parseInt(customer.id);
    return new Promise(function(resolve, reject){
        db.none('UPDATE base_prices SET name=${name}, price=${price} '+
            'WHERE id=${id}', price)
            .then(resolve())
            .catch(reject());
    });
}