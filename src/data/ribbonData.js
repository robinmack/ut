const awardConverter = require('./awardConverter');
let allRibbons = [];
module.exports = {
    init: function (){
        return new Promise(function(resolve, reject){
            awardConverter.initialize()
                .then(function() {
                    allRibbons = awardConverter.getAllRibbons()
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

    translateFromDB: function (ribbonData) {
        //parse out individual ribbons
        let ribbonDataArray = ribbonData.split("<br>");
        let ribbonVals = parseDbRibbonVals(ribbonDataArray);
        let maxRows = (ribbonDataArray.length / 3) + 1;
        maxRows++;
        //build fixed grid of individual ribbons
        let rows = [];
        for (let y = 1; y < maxRows; y++) {
            let rowBuilding = {columns: []};
            for (let x = 1; x < 5; x++) {
                let cell = ribbonVals[y + "-" + x];
                if (!!cell) {
                    let [description, attachments] = cell.text.toString().split(", ");
                    let award = allRibbons[description];
                    rowBuilding.columns.push({name:award.name,
                                            imgSrc:award.imgSrc,
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
