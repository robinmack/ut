const awardConverter = require('./awardConverter');
const _ = require('underscore');
let allRibbons = [];
let allDevicesAttachments = [];

module.exports = {
    init: function (){
        return new Promise(function(resolve, reject){
            awardConverter.initialize()
                .then(function() {
                    allRibbons = awardConverter.ribbons;
                    allDevicesAttachments = awardConverter.devicesAttachments;
                    resolve();
                })
                .catch(function(err){
                    console.log(err);
                    reject(err)
                });
        });
    },

    getAllRibbons: function() {
        return allRibbons;
    },

    getAllDevicesAttachments: function () {
        return allDevicesAttachments;
    },

    translateFromDB: function (ribbonData) {
        //parse out individual ribbons
        let ribbonDataArray = ribbonData.split("<br>");
        let ribbonVals = parseDbRibbonVals(ribbonDataArray);
        let maxCols = 0;
        let maxRows = 0;
        Object.keys(ribbonVals).forEach(function(key){
            var [rows, cols] = (key.split('-'));
            if (parseInt(cols) > maxCols){
                maxCols = cols;
            }
            if (parseInt(rows) > maxRows){
                maxRows = rows;
            }
        });

        let rows = [];
        for (let y = 1; y <= maxRows; y++) {
            let rowBuilding = {columns: []};
            for (let x = 1; x <= maxCols; x++) {
                let cell = ribbonVals[y + "-" + x];
                if (!!cell) {
                    let [description, attachments] = cell.text.toString().split(", ");
                    let award = allRibbons[description];
                    rowBuilding.columns.push({
                        name:award.name,
                        devicesAttachments: getDevicesAttachmentsObjArray(attachments),
                        code:award.code + (attachments? " " + attachments:""),
                        ribbonPrice:award.ribbonPrice,
                        largeMedalPrice:award.largeMedalPrice,
                        miniMedalPrice: award.miniMedalPrice
                    });
                } else {
                    rowBuilding.columns.push({name: "N/A"});
                }
            }
            rows.push(rowBuilding);
        }
        return rows;
    },

    translateMedalsFromDB: function (ribbonData) {
        //parse out individual ribbons
        if (ribbonData !== "") {
            let medalDataArray = ribbonData.split("<br>");
            let columns = [];
            medalDataArray.forEach(function (medal, index) {
                if (medal !== "") {
                    let [description, attachments] = medal.toString().split(", ");
                    let award = allRibbons[description];

                    columns.push({
                        name: award.name,
                        devicesAttachments: getDevicesAttachmentsObjArray(attachments),
                        code: award.code + (attachments ? " " + attachments : ""),
                        ribbonPrice: award.ribbonPrice,
                        largeMedalPrice: award.largeMedalPrice,
                        miniMedalPrice: award.miniMedalPrice
                    });
                }
            });
            return [{columns: columns}];
        }
        return [];
    }
};

function getDevicesAttachmentsObjArray(attachments) {
    if (!!attachments) {
        attachArray = attachments.split(' + ');

        attachObjs = [];
        attachArray.forEach(function (attachment) {
            attachment = attachment.trim();
            var attachObj = allDevicesAttachments[attachment];
            attachObjs.push(attachObj);
        });
        return attachObjs;
    }
    return [];
}
function parseDbRibbonVals(ribbonVals){
    let ribbonTable = {};
    ribbonVals.forEach(function(ribbon){
        let rowCol = ribbon.split(" ")[0];
        let text = ribbon.replace(rowCol + " ","");
        ribbonTable[rowCol]={text:text};
    });
    return ribbonTable;
}
