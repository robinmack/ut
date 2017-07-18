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
                    rowBuilding.columns.push({name:award.name,
                                            code:award.code + (attachments? " " + attachments:"")});
                } else {
                    rowBuilding.columns.push({name: "N/A"});
                }
            }
            rows.push(rowBuilding);
        }
        return rows;
    }
};

function parseDbRibbonVals(ribbonVals){
    let ribbonTable = {};
    ribbonVals.forEach(function(ribbon){
        let rowCol = ribbon.split(" ")[0];
        let text = ribbon.replace(rowCol + " ","");
        ribbonTable[rowCol]={text:text};
    });
    return ribbonTable;
}
