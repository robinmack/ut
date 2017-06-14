var ribbons = {};
var ribbonPaletteSelector = "";
ribbonPalette = {

    precedence: "",
    defaultPalette: "",
    staggered: false,
    rack: {},

    setup: function (settings){
        if (settings){
            staggered = settings.staggered;
            if (settings.ribbonPaletteSelector){
                ribbonPaletteSelector = settings.ribbonPaletteSelector;
            }
            if (settings.branch){
                this.defaultPalette = settings.branch;
                switch (settings.branch){
                    case "af":
                        this.precedence = precedence_af;
                        break;
                    case "army_left":
                        this.precedence = precedence_army_left;
                        break;
                    case "army_right":
                        this.precedence = precedence_army_right;
                        break;
                    case "cap":
                        this.precedence = precedence_cap;
                        break;
                    case "cg":
                        this.precedence = precedence_cg;
                        break;
                    case "cgaux":
                        this.precedence = precedence_cgaux;
                        break;
                    case "marine":
                        this.precedence = precedence_marine;
                        break;
                    case "merchant_marine":
                        this.precedence = precedence_merchant_marine;
                        break;
                    case "navy":
                        this.precedence = precedence_navy;
                        break;
                    case "noaa":
                        this.precedence = precedence_noaa;
                    case "phs":
                        this.precedence = precedence_phs;
                    case "war_service":
                        this.precedence = precedence_war_service;
                }
            }
        }
        this.renderRibbonPalette();
    },

    loadStoredRack: function(rack){
        this.rack = rack;
    },

    loadRibbons: function(ribbons){
        ribbons = ribbons;
    },

    showRibbonPalette: function(){
        $(ribbonPaletteSelector).show();
    },





    hideRibbonPalatte: function(){
        $(ribbonPalatteSelector).hide();
    }
}