const db = require("../util/dbUtil");   
module.exports = {
    getSingleOrder: function(id){
        id = parseInt(id);
        return new Promise(function (resolve, reject) {
            db.one('SELECT a.*, b.firstname, b.lastname, b.email FROM "order" a, customer b WHERE a.id=$1 AND a.customer_id = b.id', [id])
            .then(data=>resolve(data))
            .catch (function(err){
                console.log(err);
                reject(err);
            });
        })
    },

    update : function(order){
        let sql = pgFormat("UPDATE order SET " +
        //"customer_id=${customerId}," +
        "card_type=${cardType}," +
        "card_name=${cardName}," +
        "card_number=${cardNumber}," +
        "card_expire=${card_expire}," +
        "card_civ=${cardCiv}," +
        // "shipping=${shipping}," +
        // "number_ribbons=${numberRibbons}," +
        // "number_pin=${numberPin}," +
        // "number_magnetic=${numberMagnetic}," +
        // "row_fill=${rowFill}," +
        // "total_ribbons=${totalRibbons}," +
        // "list_ribbons=${listRibbons}," +
        // "number_mini_medal_sets=${numberMiniMedalSets}," +
        // "total_mini_medals=${totalMiniMedals}," +
        // "number_mini_medal_device=${numberMedalDevice}," +
        // "number_mini_medal_attach=${numberMiniMedalAttach}," +
        // "list_mini_medals=${listMiniMedals}," +
        // "name_tag_line_1=${nameTagLine1}," +
        // "name_tag_line_2=${nameTagLine2}," +
        // "number_pin_tag=${numberPinTag}," +
        // "number_magnetic_tag=${numberMagneticTag}," +
        // "tag_branch=${tagBranch}," +
        // "total_name_tag=${totalNameTag}," +
        // "comments=${comments}," +
        // "total_order=${totalOrder}," +
        // "total_grand=${totalGrand}," +
        // "number_ribbons_2=${numberRibbons2}," +
        // "number_devices_2=${numberDevices2}," +
        // "number_attach_2=${numberAttach2}," +
        // "number_pin_2=${numberPin2}," +
        // "number_magnetic_2=${numberMagnetic2}," +
        // "row_fill_2=${rowFill2}," +
        // "list_ribbon_2=${listRibbon2}," +
        // "number_large_medal_sets=${numberMedalSets}," +
        // "price_per_medal_set=${pricePerMedalSet}," +
        // "number_large_medal_device=${numberMedalDevice}," +
        // "number_large_medal_attach=${numberMedalAttach}," +
        // "anodize=${anodize}," +
        // "list_large_medals=${listLargeMedals}," +
        // "anodized_total=${anodizedTotal}," +
        // "total_medals_large=${medalsTotal}," +
        // "choice_1_pin=${choice1Pin}," +
        // "choice_2_pin=${choice2Pin}," +
        // "reverse=${reverse}," +
        // "title=${title}," +
        // "date=${date}," +
        ") where id = ${order.id}", order);
        return sql;
    },

    insert: function (order, upsert) {
        console.log("in order.insert");
        return new Promise(function (resolve, reject) {
            if (upsert) {
                upsert = " ON CONFLICT ON CONSTRAINT unique_order DO NOTHING";
            } else {
                upsert = "";
            }
            console.log("Inserting Customer");
            db.task(task=> {
                return task.one('INSERT INTO customer (lastname, firstname, addr1, addr2, city, state, zip, phone, email, service, gender) ' +
                    'VALUES (${firstname}, ${lastname}, ${addr1}, ${addr2}, ${city}, ${state}, ${zip}, ${phone}, ${email}, ${service}, ${gender}) ' +
                    'ON CONFLICT ON CONSTRAINT unique_email_addr DO UPDATE SET lastname=excluded.lastname, firstname=excluded.firstname, addr1=excluded.addr1, addr2=excluded.addr2, city=excluded.city, state=excluded.state, zip=excluded.zip, email=excluded.email, phone = excluded.phone, service = excluded.service, gender=excluded.gender ' +
                    'RETURNING id', order)
                    .then(data => {
                        console.log("inserting order for customer " + data.id);
                        order.customerId=data.id;
                        return task.oneOrNone('INSERT INTO "order" (' +
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
                            "anodize, " +
                            "list_large_medals, " +
                            "anodized_total, " +
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
                            "${anodize}," +
                            "${listLargeMedals}," +
                            "${anodizedTotal}," +
                            "${totalMedalsLarge}," +
                            "${choice1Pin}," +
                            "${choice2Pin}," +
                            "${reverse}," +
                            "${title}," +
                            "${date}" +
                            ") " + upsert + " RETURNING id ", order, )
                    });
            })
            .then(function (returnObj) {
                console.log("finalizing order");

                let data={
                    numberRibbons: !! returnObj ? order.numberRibbons : 0,
                    numberRibbons2: !! returnObj ? order.numberRibbons2 :0,
                    numberMiniMedalSets: !! returnObj ? order.numberMiniMedalSets :0,
                    numberLargeMedalSets: !! returnObj ? order.numberLargeMedalSets :0,
                    numberMagnetic: !! returnObj ? order.numberMagnetic :0,
                    totalGrand: !! returnObj ? order.totalGrand : 0,
                };

                resolve(data);
            })
            .catch((err) => reject(err));
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
            anodize: bodyProps.anodize,
            listLargeMedals: bodyProps.listLargeMedals,
            anodized_total: parseFloat(bodyProps.anodized_total),
            largeMedalsTotal: parseFloat(bodyProps.medalsTotal),
            choice1Pin: bodyProps.choice1Pin,
            choice2Pin: bodyProps.choice2Pin,
            reverse: bodyProps.reverse,
            title: bodyProps.title,
            date: bodyProps.date
        };
        return (order);
    },

    orderFromStringArray(orderFields){
        let order = {
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
            gender: orderFields[10],
            cardType: orderFields[11],
            cardName: orderFields[12],
            cardNumber: orderFields[13],
            cardExpire: orderFields[14],
            cardCiv: orderFields[15],
            shipping: orderFields[16],
            numberRibbons: orderFields[17] === "" ? 0 : parseInt(orderFields[17]),
            numberDevices: orderFields[18] === "" ? 0 : parseInt(orderFields[18]),
            numberAttach: orderFields[19] === "" ? 0 : parseInt(orderFields[19]),
            numberPin: orderFields[20] === "" ? 0 : parseInt(orderFields[20]),
            numberMagnetic: orderFields[21] === "" ? 0 :  parseInt(orderFields[21]),
            rowFill: orderFields[22],
            totalRibbons: orderFields[23] === "" ? 0 :  parseFloat(orderFields[23]),
            listRibbons: orderFields[24],
            numberMiniMedalSets: orderFields[25] === "" ? 0 :  parseInt(orderFields[25]),
            totalMiniMedals: orderFields[26] === "" ? 0 :  parseFloat(orderFields[26]),
            numberMiniMedalDevice: orderFields[27] === "" ? 0 :  parseInt(orderFields[27]),
            numberMiniMedalAttach: orderFields[28] === "" ? 0 :  parseInt(orderFields[28]),
            totalMedals: orderFields[29] === "" ? 0 : parseInt(orderFields[29]),
            listMiniMedals: orderFields[30],
            nameTagLine1: orderFields[31],
            nameTagLine2: orderFields[32],
            numberPinTag: orderFields[33] === "" ? 0 :  parseInt(orderFields[33]),
            numberMagneticTag: orderFields[34] === "" ? 0 :  parseInt(orderFields[34]),
            tagBranch: orderFields[35],
            totalNameTag: orderFields[36] === "" ? 0 :  parseFloat(orderFields[36]),
            comments: orderFields[37],
            totalOrder: orderFields[38] === "" ? 0 :  parseFloat(orderFields[38]),
            totalGrand: orderFields[39] === "" ? 0 :  parseFloat(orderFields[39]),
            numberRibbons2: orderFields[40] === "" ? 0 :  parseInt(orderFields[40]),
            numberDevices2: orderFields[41] === "" ? 0 :  parseInt(orderFields[41]),
            numberAttach2: orderFields[42] === "" ? 0 :  parseInt(orderFields[42]),
            numberPin2: orderFields[43] === "" ? 0 :  parseInt(orderFields[43]),
            numberMagnetic2: orderFields[44] === "" ? 0 :  parseInt(orderFields[44]),
            rowFill2: orderFields[45],
            listRibbon2: orderFields[46],
            numberLargeMedalSets: orderFields[47] === "" ? 0 :  parseInt(orderFields[47]),
            pricePerLargeMedalSet: orderFields[48] === "" ? 0 :  parseFloat(orderFields[48]),
            numberLargeMedalDevice: orderFields[49] === "" ? 0 :  parseInt(orderFields[49]),
            numberLargeMedalAttach: orderFields[50] === "" ? 0 :  parseInt(orderFields[50]),
            anodize: orderFields[51],
            listLargeMedals: orderFields[52],
            anodizedTotal: orderFields[53] === "" ? 0 :  parseFloat(orderFields[53]),
            totalMedalsLarge: orderFields[54] === "" ? 0 :  parseFloat(orderFields[54]),
            choice1Pin: orderFields[55],
            choice2Pin: orderFields[56],
            reverse: orderFields[57],
            title: orderFields[59],
            date: orderFields[60]
        };
        return order;
    },

    findOrder: function(order, callback){
        let query = "SELECT id, firstname, lastname, email, service, city, state, date, total_grand FROM customer_order WHERE ";
        let useAnd = false;
        if (!!order.customerId){
            query += "customer_id=" + order.customerId + " ";
            useAnd = true;
        }
        if (!!order.firstname){
            query += useAnd ? "AND ": "";
            query += setQueryField("firstname", order.firstname);
            useAnd = true;
        }
        if (!!order.lastname){
            query += useAnd ? "AND ": "";
            query += setQueryField("lastname", order.lastname);
            useAnd = true;
        }
        if (!!order.email){
            query += useAnd ? "AND ": "";
            query += setQueryField("email", order.email);
            useAnd = true;
        }
        if (!!order.city){
            query += useAnd ? "AND ": "";
            query += setQueryField("city", order.city);
            useAnd = true;
        }
        if (!!order.state){
            query += useAnd ? "AND ": "";
            query += setQueryField("state", order.state)
            useAnd = true;
        }
        if (!!order.service){
            query += useAnd ? "AND ": "";
            query += "service = " + order.service;
            useAnd = true;
        }
        if (!!order.date) {
            query += useAnd ? "AND " : "";
            query += "date = '" + order.date + "' ";

        }
        //query += " ORDER BY lastname ASC, firstname ASC, date ASC";
        db.manyOrNone(query)
        .then((data)=>{
                callback(data);
        })
        .catch((error)=>{
            console.log(error);
            callback(null, error);
        })
    }
};
function setQueryField(fieldName, value){
    return fieldName + " LIKE " + fixWildcards(value);
}
function fixWildcards(val){
    return "'" + val.replace(/\*/g, '%') + "'";
}