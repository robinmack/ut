const db = require("../util/dbUtil");
let ready = false,
    ribbons = {},
    devicesAttachments = {};

function getAllAwardInfo() {
    return new Promise(function(resolve, reject){
        getAwardsFromDb()
        .then(function(data) {
            data.rows.map(function (row) {
                ribbons[row.name] = {
                    name: row.name.toString(),
                    code: row["ribbon_graphic_name"].toString().toUpperCase(),
                    ribbonPrice: row["ribbon_price"],
                    largeMedalPrice: row["large_medal_price"],
                    miniMedalPrice: row["mini_medal_price"]
                };
            });
           resolve();
        })
        .catch((err)=>{
            console.log(Error(err));
            reject();
        });
    });
}

function getAllDevicesAttachmentsInfo(){
    return new Promise(function(resolve, reject){
        getDevicesAttachmentsFromDb()
            .then(function(data) {
                data.rows.map(function (row) {
                    devicesAttachments[row.image_name] = {
                        description: row.description.toString(),
                        code: row.image_name.toString().toUpperCase(),
                        price: row.price,
                        type: row.type
                    };
                });
                resolve();
            })
            .catch((err)=>{
                console.log(Error(err));
                reject();
            });
    });
}

function getAwardsFromDb() {
    return db.result("SELECT * FROM awards_with_prices");
}

function getDevicesAttachmentsFromDb(){
    return db.result("SELECT * FROM devices_attachments_with_prices order by description ASC");
}

module.exports = {
    initialize: function() {
        return new Promise (function (resolve, reject) {
            if (ready) {
                resolve();
            }
            if (!ready) {
                getAllAwardInfo()
                    .then(() => getAllDevicesAttachmentsInfo())
                    .then(function(){
                        ready = true;
                        resolve();
                    })
                    .catch(() =>  reject());
            }
        });
    },

    ribbons : ribbons,

    devicesAttachments : devicesAttachments
};
