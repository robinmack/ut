const fs = require('fs'),
    dbQueries = require('../util/dbQueries'),
    dataOrder = require('../data/order'),

    Ftp = require('jsftp'),
    config = require('../../orders/config.json'),
    //Promise = require('promise'),
    path = require('path'),
    appdir = path.dirname(require.main.filename);

module.exports = {
    orders: 0,
    numberRibbons:0,
    numberMiniMedalSets:0,
    numberLargeMedalSets:0,
    numberMagnetic:0,
    totalGrand:0,
    dupes: 0,

    processFile: function() {
        let that = this;
        return new Promise(function (resolve, reject) {
            that.downloadFile()
                .then((fileContents) => that.parseFile(fileContents))
                .then(() => function(){
                    console.log ("Orders Processed: " + that.orders + " totalling $" + that.totalGrand);
                    resolve({
                        orders: that.orders,
                        numberRibbons: that.numberRibbons,
                        numberMiniMedalSets: that.numberMiniMedalSets,
                        numberLargeMedalSets: that.numberLargeMedalSets,
                        numberMagnetic: that.numberMagnetic,
                        totalGrand: that.totalGrand
                    });
                })
                .catch((err) => reject(err));
        });
    },

    downloadFile: function() {
        let that=this,
            fileContents="",
            ftp = new Ftp({host: config.ftpUrl, user: config.ftpUser, pass: config.ftpPass, debugMode: true});
            ftp.on('jsftp_debug', function(eventType, data) {
                console.log('FTP DEBUG: ', eventType);
                console.log(JSON.stringify(data, null, 2));
            });
        return new Promise(function(resolve, reject){

            ftp.get(config.filePath, function (err,socket) {
                if(err){
                    console.log("jsftp error: " + err);
                    reject(Error(err));
                } else {
                    socket.on("data", (data)=> fileContents += data.toString());
                    socket.on("close", function(err){
                        if (!!err) {
                            ftp.destroy();
                            reject(Error(err));
                        } else {
                            console.log("Downloaded file");
                            ftp.destroy();
                            resolve(fileContents);
                        }
                    });
                    socket.resume();
                }
            });
        });
    },

    parseFile: function(fileContents) {
        let filename = 'orders/webdata.txt';
        let orders = fileContents.split("\r\n");
        fs.writeFile(filename,fileContents);
        let i = 0;
        let that = this;
        console.log("in ParseFile");
        return new Promise(function (resolve, reject) {

            orders.forEach(function (order) {
                if (order.toString() != "") {
                    that.extractCustomer(order)
                    .then((customerId) => that.extractOrder(customerId))
                    .then(Promise.resolve())
                    .catch((err) => function (err) {
                        console.log(err);
                        Promise.resolve();
                    });
                }
            });
        });
    },

    extractCustomer: function(order) {
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
            phone: orderFields[7].replace("(", "").replace(")", "").replace("-", "").replace(".").replace(" ", ""),
            email: orderFields[8],
            service: orderFields[9],
            gender: orderFields[10]
        };
        console.log("In extractCustomer");
        return new Promise(function (resolve, reject) {
            dbQueries.upsertCustomer(customer, orderFields).then((customerId) => function(customerId) {
                console.log("inserted customer");
                resolve(customerId);
            })
            .catch((err) => function(err){
                console.log(err);
                resolve()
            });
        });
    },

    extractOrder: function(customerId, orderFields) {
        //before insert, make certain order is not a dupe\
        let order = dataOrder.orderFromStringArray(orderFields);
        console.log("In extract Order");
        order.customerId = customerId;
        return new Promise(function (resolve, reject) {
            dbQueries.upsertOrder(order)
                .then(function (data) {
                    this.orders++;
                    this.numberRibbons += data.numberRibbons;
                    this.numberMiniMedalSets += data.numberMiniMedalSets;
                    this.numberLargeMedalSets += data.numberLargeMedalSets;
                    this.numberMagnetic += data.numberMagnetic;
                    this.totalGrand += data.totalGrand;
                    console.log("inserted order");
                    resolve();
                })
                .catch((err)=>function(err){
                    console.log(err);
                    this.dupes ++;
                    resolve();
                });
        });
    }
}