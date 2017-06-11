const fs = require('fs'),
    dataOrder = require('../data/order'),
    Promise = require('promise'),
    Ftp = require('promise-ftp'),
    config = require('../../orders/config.json'),
    path = require('path');
    

let report = {};

module.exports = {
    processFile: function() {
        report = {
            orders: 0,
            numberRibbons: 0,
            numberMiniMedalSets: 0,
            numberLargeMedalSets:0,
            numberMagnetic:0,
            totalGrand:0,
            dupes: 0
        };
        const that = this;
        return new Promise(function (resolve, reject) {
            that.downloadFile()
                .then(function(fileContents){
                    return that.parseFile(fileContents);
                })
                .then(function(){
                    console.log ("New Orders Processed: " + that.orders + " totalling $" + that.totalGrand);
                    resolve(report);
                })
                .catch(function(err){
                    console.log(err);
                    reject(err);
                });
        });
    },

    downloadFile: function() {
        let fileContents="";
        return new Promise(function(resolve, reject){
            let ftp = new Ftp();
            ftp.connect({host: config.ftpUrl, user: config.ftpUser, password: config.ftpPass})
                .then(() => {
                return ftp.ascii();
            })
            .then(() => {
                return ftp.get(config.ftpFilePath);
            })
            .then((stream) => {
                return new Promise(function (resolve, reject) {
                    stream.once('close', resolve);
                    stream.once('error', reject);
                    stream.on('data', (data)=>{
                        fileContents += data.toString();
                    });
                });
            })
            .then(()=>{resolve(fileContents);  ftp.end;})
            .catch((err)=>{
                reject(err);
            });
        });
    },

    parseFile: function(fileContents) {
        const filename = 'orders/webdata.txt';
        let orders = fileContents.split("\r\n");
        fs.writeFile(filename,fileContents);
        const that = this;
        return new Promise(function (resolve, reject) {
            let orderPromises = [];
            orders = orders.filter(order=>order.length>1)
            orders.forEach(function (order) {
                orderPromises.push(that.extractCustomerOrder(order.split(";")));
            });
            Promise.all(orderPromises)
            .then(function(){
                console.log("***JOB DONE!***");
                resolve();
            })
            .catch(function (err) {
                console.log(err);
                reject(err);
            });
        });
    },

    extractCustomerOrder: function(orderFields) {
        //before insert, make certain order is not a dupe\
        const that=this;
        let order = dataOrder.orderFromStringArray(orderFields);
        console.log("In extract CustomerOrder");
        return new Promise(function (resolve, reject) {
            return dataOrder.insert(order,true)
                .then(function (data) {
                    report.orders++;
                    report.numberRibbons += parseInt(data.numberRibbons ||0);
                    report.numberRibons += parseInt(data.numberRibbons2 ||0);
                    report.numberMiniMedalSets += parseInt(data.numberMiniMedalSets||0);
                    report.numberLargeMedalSets += parseInt(data.numberLargeMedalSets||0);
                    report.numberMagnetic += parseInt(data.numberMagnetic||0);
                    report.totalGrand += parseFloat(data.totalGrand||0);

                    console.log("inserted order");
                    resolve();
                })
                .catch(function(err){
                    console.log(err);
                    this.dupes ++;
                    reject(err);
                });
        });
    }
};