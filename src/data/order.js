let pgFormat = require("pg-format");
let dbUtil = require("../util/dbQueries");

module.exports = {
    update : function(order){
        let sql = pgFormat("UPDATE orders SET " +
        "customer_id=${customerId}," +
        "card_type=${cardType}," +
        "card_name=${cardName}," +
        "card_number=${cardNumber}," +
        "card_expire=${card_expire}," +
        "card_civ=${cardCiv}," +
        "shipping=${shipping}," +
        "number_ribbons=${numberRibbons}," +
        "number_pin=${numberPin}," +
        "number_magnetic=${numberMagnetic}," +
        "row_fill=${rowFill}," +
        "total_ribbons=${totalRibbons}," +
        "list_ribbons=${listRibbons}," +
        "number_mini_medal_sets=${numberMiniMedalSets}," +
        "total_mini_medals=${totalMiniMedals}," +
        "number_mini_medal_device=${numberMedalDevice}," +
        "number_mini_medal_attach=${numberMiniMedalAttach}," +
        "list_mini_medals=${listMiniMedals}," +
        "name_tag_line_1=${nameTagLine1}," +
        "name_tag_line_2=${nameTagLine2}," +
        "number_pin_tag=${numberPinTag}," +
        "number_magnetic_tag=${numberMagneticTag}," +
        "tag_branch=${tagBranch}," +
        "total_name_tag=${totalNameTag}," +
        "comments=${comments}," +
        "total_order=${totalOrder}," +
        "total_grand=${totalGrand}," +
        "number_ribbons_2=${numberRibbons2}," +
        "number_devices_2=${numberDevices2}," +
        "number_attach_2=${numberAttach2}," +
        "number_pin_2=${numberPin2}," +
        "number_magnetic_2=${numberMagnetic2}," +
        "row_fill_2=${rowFill2}," +
        "list_ribbon_2=${listRibbon2}," +
        "number_large_medal_sets=${numberMedalSets}," +
        "price_per_medal_set=${pricePerMedalSet}," +
        "number_large_medal_device=${numberMedalDevice}," +
        "number_large_medal_attach=${numberMedalAttach}," +
        "annodize=${annodize}," +
        "list_large_medals=${listLargeMedals}," +
        "annodized_total=${annodizedTotal}," +
        "total_medals_large=${medalsTotal}," +
        "choice_1_pin=${choice1Pin}," +
        "choice_2_pin=${choice2Pin}," +
        "reverse=${reverse}," +
        "title=${title}," +
        "date=${date}," +
        ")", order);
        return sql;
    },

    insert: function(order, upsert, db, callback) {
        if (upsert){
            upsert = " ON CONFLICT ON CONSTRAINT unique_orders DO NOTHING";
        } else {
            upsert = "";
        }
        db.result("INSERT INTO orders (" +
        "customer_id, " +
        "card_type, " +
        "card_name, " +
        "card_number, " +
        "card_expire, " +
        "card_civ, " +
        "shipping, " +
        "number_ribbons, " +
        "number_devices, " +
        "number_attachments, " +
        "number_pins, " +
        "number_magnetic, " +
        "row_fill, " +
        "total_ribbons, " +
        "list_ribbons, " +
        "number_mini_medal_sets, " +
        "total_mini_medals, " +
        "number_mini_medal_device, " +
        "number_mini_medal_attach, " +
        "total_medals," +    
        "list_mini_medals, " +
        "name_tag_line_1, " +
        "name_tag_line_2, " +
        "number_pin_tag, " +
        "number_magnetic_tag, " +
        "tag_branch, " +
        "total_name_tag, " +
        "comments, " +
        "total_order, " +
        "total_grand, " +
        "number_ribbons_2, " +
        "number_devices_2, " +
        "number_attach_2, " + 
        "number_pin_2, " +
        "number_magnetic_2, " +
        "row_fill_2, " +
        "list_ribbon_2, " +
        "number_large_medal_sets, " +
        "price_per_large_medal_set, " +
        "number_large_medal_device, " +
        "number_large_medal_attach, " +
        "annodize, " +
        "list_large_medals, " +
        "annodized_total, " +
        "total_medals_large, " +
        "choice_1_pin, " +
        "choice_2_pin, " +
        "reverse, " +
        "title, " +
        "date" +
        ") VALUES (" +
        "${customerId}," + 
        "${cardType}," +
        "${cardName}," +
        "${cardNumber}," +
        "${cardExpire}," +
        "${cardCiv}," +
        "${shipping}," +
        "${numberRibbons}," +
        "${numberDevices}," +
        "${numberAttach}," +
        "${numberPin}," +
        "${numberMagnetic}," +
        "${rowFill}," +
        "${totalRibbons}," +
        "${listRibbons}," +
        "${numberMiniMedalSets}," +
        "${totalMiniMedals}," +
        "${numberMiniMedalDevice}," +
        "${numberMiniMedalAttach}," +
        "${totalMedals}," +
        "${listMiniMedals}," +
        "${nameTagLine1}," +
        "${nameTagLine2}," +
        "${numberPinTag}," +
        "${numberMagneticTag}," +
        "${tagBranch}," +
        "${totalNameTag}," +
        "${comments}," +
        "${totalOrder}," +
        "${totalGrand}," +
        "${numberRibbons2}," +
        "${numberDevices2}," +
        "${numberAttach2}," +
        "${numberPin2}," +
        "${numberMagnetic2}," +
        "${rowFill2}," +
        "${listRibbon2}," +
        "${numberLargeMedalSets}," +
        "${pricePerLargeMedalSet}," +
        "${numberLargeMedalDevice}," +
        "${numberLargeMedalAttach}," +
        "${annodize}," +
        "${listLargeMedals}," +
        "${annodizedTotal}," +
        "${totalMedalsLarge}," +
        "${choice1Pin}," +
        "${choice2Pin}," +
        "${reverse}," +
        "${title}," +
        "${date}" +
        ") " + upsert + " RETURNING id", order)
        .then(function(data){
            callback(data);
        })
        .catch(function(err){
            console.log(err);
            callback();
        });       
    },

    populateOrder: function(bodyProps){
        let order = {
            customerId: parseInt(bodyProps.customerId),
            cardType: bodyProps.cardType,
            cardName: bodyProps.cardName,
            cardNumber: bodyProps.cardNumber,
            cardExpire: bodyProps.cardExpire,
            cardCiv: bodyProps.cardCiv,
            shipping: bodyProps.shipping,
            numberRibbons: parseInt(bodyProps.numberRibbons),
            numberDevices: parseInt(bodyProps.numberDevices),
            numberAttach: parseInt(bodyProps.numberAttach),
            numberPin: parseInt(bodyProps.numberPin),
            numberMagnetic: parseInt(bodyProps.numberMagnetic),
            rowFill: bodyProps.rowFill,
            totalRibbons: parseFloat(bodyProps.totalRibbons),
            listRibbons: bodyProps.listRibbons,
            numberMiniMedalSets: parseInt(bodyProps.numberMiniMedalSets),
            totalMiniMedals: parseFloat(bodyProps.totalMiniMedals),
            numberMiniMedalDevice: parseInt(bodyProps.numberMiniMedalDevice),
            numberMiniMedalAttach: parseInt(bodyProps.numberMiniMedalAttach),
            totalMedals: parseFloat(bodyProps.totalMedals),
            listMiniMedals: bodyProps.listMiniMedals,
            nameTagLine1: bodyProps.nameTagLine1,
            nameTagLine2: bodyProps.nameTagLine2,
            numberPinTag: parseInt(bodyProps.numberPinTag),
            numberMagneticTag: parseInt(bodyProps.numberMagneticTag),
            tagBranch: bodyProps.tagBranch,
            totalNameTag: parseFloat(bodyProps.totalNameTag),
            comments: bodyProps.comments,
            totalOrder: parseFloat(bodyProps.totalOrder),
            totalGrand: parseFloat(bodyProps.totalGrand),
            numberRibbons2: parseInt(bodyProps.numberRibbons2),
            numberDevices2: parseInt(bodyProps.numberDevices2),
            numberAttach2: parseInt(bodyProps.numberAttach2),
            numberPin2: parseInt(bodyProps.numberPin2),
            numberMagnetic2: parseInt(bodyProps.numberMagnetic2),
            rowFill2: bodyProps.rowFill2,
            listRibbon2: bodyProps.listRibbon2,
            numberLargeMedalSets: parseInt(bodyProps.numberLargeMedalSets),
            pricePerLargeMedalSet: parseFloat(bodyProps.pricePerLargeMedalSet),
            numberLargeMedalDevice: parseInt(bodyProps.numberLargeMedalDevice),
            numberLargeMedalAttach: parseInt(bodyProps.numberLargeMedalAttach),
            annodize: bodyProps.annodize,
            listLargeMedals: bodyProps.listLargeMedals,
            annodized_total: parseFloat(bodyProps.annodized_total),
            largeMedalsTotal: parseFloat(bodyProps.medalsTotal),
            choice1Pin: bodyProps.choice1Pin,
            choice2Pin: bodyProps.choice2Pin,
            reverse: bodyProps.reverse,
            title: bodyProps.title,
            date: bodyProps.date
        }
        return (order);
    },

    orderFromStringArray(array){
        let order = {
            customer_id: array[10] == "" ? 0 : parseInt(array[10]),
            cardType: array[11],
            cardName: array[12],
            cardNumber: array[13],
            cardExpire: array[14],
            cardCiv: array[15],
            shipping: array[16],
            numberRibbons: array[17] == "" ? 0 : parseInt(array[17]),
            numberDevices: array[18] == "" ? 0 : parseInt(array[18]),
            numberAttach: array[19] == "" ? 0 : parseInt(array[19]),
            numberPin: array[20] == "" ? 0 : parseInt(array[20]),
            numberMagnetic: array[21] == "" ? 0 :  parseInt(array[21]),
            rowFill: array[22],
            totalRibbons: array[23] == "" ? 0 :  parseFloat(array[23]),
            listRibbons: array[24],
            numberMiniMedalSets: array[25] == "" ? 0 :  parseInt(array[25]),
            totalMiniMedals: array[26] == "" ? 0 :  parseFloat(array[26]),
            numberMiniMedalDevice: array[27] == "" ? 0 :  parseInt(array[27]),
            numberMiniMedalAttach: array[28] == "" ? 0 :  parseInt(array[28]),
            totalMedals: array[29] == "" ? 0 : parseInt(array[29]),
            listMiniMedals: array[30],
            nameTagLine1: array[31],
            nameTagLine2: array[32],
            numberPinTag: array[33]=="" ? 0 :  parseInt(array[33]),
            numberMagneticTag: array[34]=="" ? 0 :  parseInt(array[34]),
            tagBranch: array[35],
            totalNameTag: array[36] == "" ? 0 :  parseFloat(array[36]),
            comments: array[37],
            totalOrder: array[38] == "" ? 0 :  parseFloat(array[38]),
            totalGrand: array[39] == "" ? 0 :  parseFloat(array[39]),
            numberRibbons2: array[40] == "" ? 0 :  parseInt(array[40]),
            numberDevices2: array[41] == "" ? 0 :  parseInt(array[41]),
            numberAttach2: array[42] == "" ? 0 :  parseInt(array[42]),
            numberPin2: array[43] == "" ? 0 :  parseInt(array[43]),
            numberMagnetic2: array[44] == "" ? 0 :  parseInt(array[44]),
            rowFill2: array[45],
            listRibbon2: array[46],
            numberLargeMedalSets: array[47] == "" ? 0 :  parseInt(array[47]),
            pricePerLargeMedalSet: array[48] == "" ? 0 :  parseFloat(array[48]),
            numberLargeMedalDevice: array[49] == "" ? 0 :  parseInt(array[49]),
            numberLargeMedalAttach: array[50] == "" ? 0 :  parseInt(array[50]),
            annodize: array[51],
            listLargeMedals: array[52],
            annodizedTotal: array[53] == "" ? 0 :  parseFloat(array[53]),
            totalMedalsLarge: array[54] == "" ? 0 :  parseFloat(array[54]),
            choice1Pin: array[55],
            choice2Pin: array[56],
            reverse: array[57],
            title: array[59],
            date: array[60]
        }
        return order;
    },

    findOrder: function(order, db, callback){
        let query = "SELECT id, firstname, lastname, email, phone, service, city, state FROM customer WHERE ";
    let useAnd = false;
    if (!!order.firstname){
        query += useAnd ? "AND ": "";
        query += dbUtil.setQueryField("firstname", order.firstname);
        useAnd = true;
    }
    if (!!order.lastname){
        query += useAnd ? "AND ": "";
        query += dbUtil.setQueryField("lastname", order.lastname);
        useAnd = true;
    }
    if (!!order.email){
        query += useAnd ? "AND ": "";
        query += dbUtil.setQueryField("email", order.email);
        useAnd = true;
    }
    if (!!order.city){
        query += useAnd ? "AND ": "";
        query += dbUtil.setQueryField("city", order.city);
        useAnd = true;
    }
    if (!!order.state){
        query += useAnd ? "AND ": "";
        query += dbUtil.setQueryField("city", order.state)
    }
    if (!!order.date){
        query += useAnd ? "AND ": "";
        query += "date = '"+ order.date +"' ";
    }
    query += "ORDER BY lastname ASC, firstname ASC date ASC"
        db.result(query)
        .then(function(data){
            callback(data);
        })
        .catch(function(){
            callback(null);
        })
    }
}