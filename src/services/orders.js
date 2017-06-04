var fs = require('fs');
var dbQueries = require('../util/dbQueries');
var dataOrder = require('../data/order');

module.exports = {
    orders: 0,
    ribbonSets:0,
    medalSets:0,
    
    parseFile: function(callback){
        let filename = 'orders/webdata.txt';
        var orders = fs.readFileSync(filename).toString().split("\n");
        let i = 0;
        let that = this;
        orders.forEach(function(order){
            if(! order == "") {
                that.extractCustomer(order);
                i++;
            }
        });
        callback(i);
    },
    extractCustomer: function(order){
        //before insert, make certain customer is not a dupe, upsert
        //criteria:  email is the same
        let orderFields = order.split(";");
        let customer = {
            lastname: orderFields[1],
            firstname: orderFields[0],
            addr1: orderFields[2],
            addr2: orderFields[3],
            city: orderFields[4],
            state: orderFields[5],
            zip: orderFields[6],
            phone: orderFields[7].replace("(","").replace(")","").replace("-","").replace(".").replace(" ",""),
            email: orderFields[8],
            service: orderFields[9],
            gender: orderFields[10]
        };
        dbQueries.upsertCustomer(customer, orderFields, this.extractOrder);
    },

    extractOrder: function(customerId, orderFields){
        //before insert, make certain order is not a dupe\
        let order = dataOrder.orderFromStringArray(orderFields);
        order.customerId = customerId;
        dbQueries.upsertOrder(order, function(){
            this.orders++;
        });
    },
}