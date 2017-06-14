const db = require("../util/dbUtil"),
    Promise = require('promise');
let ready = false,
    ribbons={};

function getAllAwardInfo() {
    return new Promise(function(resolve, reject){
        getAwardsFromDb()
        .then(function(data) {
            data.rows.map(function (row) {
                ribbons[row.name] = {name: row.name.toString(),
                                    imgSrc: "/images/ribimages/" + row.ribbon_graphic_name.toString().toUpperCase() + ".jpg",
                                    code: row.ribbon_graphic_name.toString().toUpperCase()};
            });
           ready = true;
           resolve();

        })
        .catch((err)=>{
            console.log(Error(err));
            ready = false;
            reject();
        });
    });
}

function getAwardsFromDb() {
    return db.result("SELECT * FROM awards");
}
module.exports = {
    initialize: function() {
        return new Promise (function (resolve, reject) {
            if (!ready) {
                getAllAwardInfo()
                    .then(() => resolve())
                    .catch(() =>  reject());
            } else {
                resolve();
            }
        });
    },

    getAllRibbons : function() {
        return ribbons;
    }
};
