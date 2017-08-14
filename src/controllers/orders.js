const orderService = require("../services/orders"),
    dataOrder = require('../data/order'),
    dataAwards = require('../data/awardData'),
    {RibbonPaletteInfo} = require('../data/ribbonPaletteInfo');
module.exports = {
    getNewOrders: function(req, res, next) {
        if (parseInt(req.session.role) === 0){
            orderService.processFile()
                .then(function(data){
                    let motd = "Successfully processed: " + data.orders + " orders, " + data.numberRibbons + " ribbons, " +
                        data.numberMiniMedalSets + " mini medal sets, " + data.numberLargeMedalSets + " large medal sets, " +
                        data.numberMagnetic + " magnetics, and $" + data.totalGrand.toFixed(2) + " in orders.";
                    res.render('main', {appTitle:"Processed Orders", role: req.session.role, motd: motd});
                })
                .catch((err)=>next(err));
        } else {
            return next("Your account does not have privileges to perform this action");
        }
    },

    find: function(req, res, next){
        if (parseInt(req.session.role) < 3 && parseInt(req.session.role) > -1){
            let customerOrder = {
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                city: req.body.city,
                state: req.body.state,
                branch: req.body.branch,
                date: req.body.date
            };
            dataOrder.findOrder(customerOrder, function (data, err){
                if(err){
                    next (err);
                } else {
                    if (data && data.length === 0){
                        data=[{firstname:"None Found",lastname:"N/A",email:"N/A",date:"N/A",city:"N/A", state:"N/A", totalGrand:"N/A"}];
                    }
                    res.render('orderFind', {appTitle:"Find Order", role: req.session.role, customerOrders: data});
                }
            });
        } else {
            return next("Your account does not have privileges to perform this action");
        }
    },

    edit: function(req, res, next){
        if (parseInt(req.session.role) < 4 && parseInt(req.session.role) >= 0){
            if (!isNaN(req.params.id)) {
                let orderId = parseInt(req.params.id),
                    orderData = {};
                dataOrder.getSingleOrder(orderId)

                    .then(function (data) {
                        orderData = data;
                        dataAwards.init()
                            .then(function () {
                                let devicesAttachments = dataAwards.getAllDevicesAttachments();
                                //let prices = dataAwards.getAllPrices();
                                let ribbonData1 = dataAwards.translateFromDB(data["list_ribbons"]);
                                let ribbonPaletteInfo = new RibbonPaletteInfo(dataAwards.getAllRibbons());
                                let ribbonData2 = dataAwards.translateFromDB(data["list_ribbon_2"]);
                                let listMiniMedals = dataAwards.translateMedalsFromDB(data["list_mini_medals"]);
                                let listLargeMedals = dataAwards.translateMedalsFromDB(data["list_large_medals"]);
                                let precedenceLists = ribbonPaletteInfo.getPrecedenceLists();
                                res.render('orderView', {
                                    appTitle: "Edit Order",
                                    role: req.session.role,
                                    method: "PUT",
                                    action: "/api/orders/" + orderId,
                                    buttonText: "Submit Changes",
                                    order: orderData,
                                    listRibbons1: ribbonData1,
                                    listRibbons2: ribbonData2,
                                    listMiniMedals: listMiniMedals,
                                    listLargeMedals: listLargeMedals,
                                    ribbonPalettes: ribbonPaletteInfo.tabs,
                                    precedenceLists: precedenceLists,
                                    devicesAttachments: devicesAttachments
                                });
                            })
                            .catch(function (err) {
                                next(err);
                                console.log(err);
                            });
                    })
                    .catch(function (err) {
                        next(err);
                    });
            } else {
                next();
            }
        } else {
            return next("Your account does not have privileges to perform this action");
        }
    },
};