function Rack(precedenceLists, biggerThanBuilder) {
    this.precedence=[];
    this.precedenceLists = precedenceLists;
    this.biggerThanBuilder = biggerThanBuilder;
    this.service = "";

    this.guessOP = function (service) {
        var retVal="";
        switch (service.toLowerCase()){
            case "army":
                retVal = "army-right";
                break;
            case "navy":
                retVal = "navy";
                break;
            case "air force":
                retVal = "af";
                break;
            case "marines":
                retVal = "marine";
                break;
            case "coast guard":
                retVal = "cg";
                break;
            case "civil air patrol":
                retVal = "cap";
                break;
            case "coast guard auxiliary":
                retVal = "cgaux";
                break;
            case "public health service":
                retVal = "phs";
                break;
            case "noaa":
                retVal = "noaa";
                break;
            case  "merchant marine":
                retVal = "merchant_marine";
                break;
        }
        this.service = retVal;
        return retVal;
    };

    this.setPrecedence = function (branch){
        switch (branch) {
            case "af":
                this.precedence = this.precedenceLists.af;
                break;
            case "army_left":
                this.precedence = this.precedenceLists["army-left"];
                break;
            case "army_right":
                this.precedence = this.precedenceLists["army-right"];
                break;
            case "cap":
                this.precedence = this.precedenceLists.cap;
                break;
            case "cg":
                this.precedence = this.precedenceLists.cg;
                break;
            case "cgaux":
                this.precedence = this.precedenceLists.cgaux;
                break;
            case "marine":
                this.precedence = this.precedenceLists.marine;
                break;
            case "merchant_marine":
                this.precedence = this.precedenceLists["merchant-marine"];
                break;
            case "navy":
                this.precedence = this.precedenceLists.navy;
                break;
            case "noaa":
                this.precedence = this.precedenceLists.noaa;
                break;
            case "phs":
                this.precedence = this.precedenceLists.phs;
                break;
            case "war_service":
                this.precedence = this.precedenceLists["war-service"];
                break;
        }
        return this;
    };

    this.renderRack = function (rack, rackSelector, medals) {
        if (!!rack) {
            var sortedRack = [],
                bareRibbons = [],
                colWidth = 3;
            if (this.service === "army-right" || this.service === "army-left"){
                colWidth = 4;
            }

            var emptyIndexes = [];


            rack.forEach(function (row, rowIndex) {
                row.columns.forEach(function (column, colIndex){
                    if (column.name === "N/A" || column.code == undefined || column.code === ""){
                        emptyIndexes.push((rowIndex*colWidth)+ colIndex);
                    } else {
                        bareRibbons.push(column);
                    }
                });
            });
            //grab empties
            if (medals) {
                colWidth = 5;
            }

            this.precedence.forEach(function (award) {
                bareRibbons.forEach(function (column) {
                    if (! column.code){
                        debugger;
                    }
                    if (column.code && award === column.code.split(" ")[0]) {
                        sortedRack.push(column);
                    }
                });
            });
            emptyIndexes.forEach(function (index){
                sortedRack.splice(index,0,{name:"N/A"});
            });

            var displayRack=[];
            var colIndex = 0;
            $(rackSelector).empty();
            var awardButtonText = "Add Ribbon";
            if (medals){
                awardButtonText = "Add Medal";
            }
            var rowHtml =
                '<div style="col-md-12 well">' +
                '<table class="table">' +
                '   <tbody>' +
                '       <tr><td colspan = 5><div style="text-align: center;"><a class="button" href="#" data-toggle="modal" data-target="#ribbonPalette" data-awardsource="' + rackSelector + '" onclick="setAwardSource(event)"><i class="fa fa-plus" aria-hidden="true"></i>' + awardButtonText + '</a></div></td></tr>';
            var columns = [];
            sortedRack.forEach(function (ribbon, index) {
                if (!medals) {
                    if (colIndex == 0) {
                        rowHtml +=
                            '<tr class="rack-row">' +
                            '<td class="col-md-2 ribbon">' +
                            '<div style="text-align: center;">' +
                            '   <input name="ribbonQtyRow" class="single-digit form-control input-medium" value= ' + colWidth.toString() + ' readonly=' + !this.biggerThanBuilder + '/>';
                    }
                    if (colIndex == 0) {
                        rowHtml +=
                            ' / <input name="ribbonMaxRow" class="single-digit form-control input-medium" value= ' + colWidth.toString() + ' readonly=' + !this.biggerThanBuilder + '/>';

                    }
                    rowHtml += '</div> </td>';
                } else if (colIndex ==0) {
                    rowHtml +=
                        '<tr class="rack-row">';
                }
                var img = "";
                var ribbonName="";
                var addDeviceAttachmentButton = '<a class="button" href="#" data-toggle="modal" data-target="#devicesAttachmentsPalette" data-award=\'' + JSON.stringify(ribbon) + '\' data-awardsource="' + rackSelector + '" onclick="setDeviceAttachmentSource(event)"><i class="fa fa-plus" aria-hidden="true"></i>Att/Dev</a>' +
                                                '<a class="button" href="#" data-award=\'' + encodeURI(JSON.stringify(ribbon)) + '\' data-awardsource="' + rackSelector + '" onclick="removeDeviceAttachment(event)"><i class="fa fa-minus" aria-hidden="true"></i>Att/Dev</a>';

                if (ribbon.code != "" && ribbon.code != undefined){
                    img = '<img src="/images/ribimages/' + ribbon.code.split(" ")[0] +'.jpg" class = "ribbon" data-code="' + ribbon.code + '" title= "' + ribbon.name + '" alt="N/A">';
                    ribbonName=ribbon.name;
                } else {
                    img = '<p> Empty Space </p>';
                    ribbonName="Empty Space";
                    addDeviceAttachmentButton = "";
                }

                var ribbonCode = "";
                if (ribbon.code) {
                    ribbonCode = ribbon.code;
                }

                var attachmentLayer = "";
                ribbonCode.split(" ").forEach(function (code, index){
                    if (index == 0){
                        attachmentLayer += '<div class="overlay">';
                    }
                    if (index > 0 && code !== "+" && code != "GF") {
                        attachmentLayer += '<img src="/images/ribimages/devices/gif/' + code + '.gif" title= "' + ribbonName + '" data-code = "' + code + '" alt="N/A">';
                    } else if (code === "GF"){
                        attachmentLayer += '<div class="overlay"><img src="/images/ribimages/devices/gif/' + code + '.gif" title= "' + name + '" data-code="' + code + '" alt="N/A"></div>';
                    }
                });

                if (attachmentLayer.length > 0) {
                    attachmentLayer += "</div>"
                }
                var insertSpacer = "";
                if (! medals) {
                    insertSpacer = '<a class="button" href="#" data-toggle="modal" data-award="' + encodeURI(JSON.stringify(ribbon)) + '" data-awardsource="' + rackSelector + '" onclick="insertSpacer(event)"><i class="fa fa-plus" aria-hidden="true"></i>Space</a>';
                }
                rowHtml +=
                    '<td class="col-md-2">' +
                        '<div class = "ribbon-cell" data-award="' + encodeURI(JSON.stringify(ribbon)) + '">' +
                            '<div style="text-align: center;" class="ribbon-img">' +
                                img +
                                attachmentLayer +
                            '</div>' +
                            '<div style="text-align: center;" class="ribbonImg">' +
                                    '<p class="code">' + ribbonCode + '</p>' +
                                        '<span style="font-size: 90%;">' +
                                            '<a class="button" href="#" data-award-source="' + rackSelector + '" data-ribbon=\'' + JSON.stringify(ribbon) + '\' onclick="removeAward(event)"><i class="fa fa-trash-o" aria-hidden="true"></i></a>' +
                                            addDeviceAttachmentButton +
                                            insertSpacer +
                                        '</span>' +
                                '</div>' +
                            '</div>' +
                        '</div>';
                    '</td>';

                if(colIndex == colWidth - 1) {
                    colIndex = 0;
                    rowHtml +=
                        '</tr>' +
                        '<tr class="rack-row-spacer"> </tr>';
                    columns.push(ribbon);
                    displayRack.push({columns: columns});
                    columns = [];
                } else {
                    colIndex ++;
                    columns.push(ribbon);
                }
            });
            if (columns.length > 0) {
                displayRack.push({columns: columns});
            }
            rowHtml += '</tbody></table></div>';
            $(rackSelector).append(rowHtml);
        }
        return displayRack;
    };

    this.getRackForSubmit = function (rackSelector){
        var rack = "";
        $(rackSelector + " .rack-row").each(function (index, row){
            if ($(row).find('.ribbon-cell').length > 0) {
                var rowNum = index + 1;
                $(row).find('.ribbon-cell').each(function(index, selectedCell){
                    var colNum = index + 1;
                    var prefix = "";
                    if (!((rowNum == 1) && (colNum == 1))){
                        prefix = "<br>";
                    }
                    rack += prefix + rowNum.toString() + "-" + colNum.toString() + " " +
                        $(selectedCell).find("img").data("code");
                });
            }
        });
        return rack;
    };

    this.getTotalsForRack = function (rackSelector, type){
        var awardCount = 0,
            awardDeviceCount = 0,
            awardAttachmentCount = 0,
            awardTotal = 0;
        $(rackSelector + " .rack-row").each(function (index, row) {
            $(row).find('.ribbon-cell').each(function (index, selectedCell) {

                var award = JSON.parse(decodeURI($(selectedCell).data("award").toString()));
                if (award.name !== "N/A") {
                    awardCount++;
                    switch (type) {
                        case "miniMedal":
                            awardTotal += parseFloat(award["miniMedalPrice"]);
                            break;
                        case "largeMedal":
                            awardTotal += parseFloat(award["largeMedalPrice"]);
                            break;
                        case "ribbon":
                            awardTotal += parseFloat(award["ribbonPrice"]);
                            break;
                    }
                    if (!!award.devicesAttachments) {
                        award.devicesAttachments.forEach(function (deviceAttachment) {
                            if (!!deviceAttachment.price) {
                                if (deviceAttachment.type === "device") {
                                    awardDeviceCount++;
                                } else {
                                    awardAttachmentCount++;
                                }
                                awardTotal += parseFloat(deviceAttachment.price);
                            }
                        });
                    }
                }
            });
        });
        return {
            awardCount: awardCount,
            awardDeviceCount: awardDeviceCount,
            awardAttachmentCount: awardAttachmentCount,
            awardTotal: awardTotal.toFixed(2) || 0.00
        }
    };
    return this;
}
