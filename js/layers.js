addLayer("p", {
    name: "prestige", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0,
    row: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#123456",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "prestige points", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade('p', 14)) mult = mult.times(2)
        if (hasUpgrade('p', 21)) mult = mult.times(upgradeEffect('p', 21))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    upgrades: {
        11: {
            title: "Start",
            description: "Earn 1 point per second",
            cost: new Decimal(1),
        },
        12: {
            title: "Speed up production",
            description: "Double your point gain.",
            cost: new Decimal(1),
            unlocked() {return hasUpgrade("p", 11) },
        },
        13: {
            title: "Extend the point gain",
            description: "Point gain is based on your prestige points.",
            cost: new Decimal(3),
            effect() {
                return player[this.layer].points.add(1).pow(0.4)
            },
            unlocked() {return hasUpgrade("p", 12) },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        14: {
            title: "Double your Prestige point gain",
            description: "There is a 2x effect for the prestige gain",
            cost: new Decimal(7),
            unlocked() {return hasUpgrade("p", 13) },
        },
        21: {
            title: "Increase Prestige point gain",
            description: "Prestige point gain is based on the amount of points you have",
            cost: new Decimal(15),
            effect() {
                return player.points.add(1).pow(0.05)
            },
            unlocked() {return hasUpgrade("p", 14) },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        22: {
            title: "Multiply point gain",
            description: "Point gain is based on the amount of points you have",
            cost: new Decimal(50),
            effect() {
                return player.points.add(1).pow(0.11)
            },
            unlocked() {return hasUpgrade("p", 21) },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
    },
})
addLayer("b", {
    name: "bricks", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "B", // This appears on the layer's node. Default is the id with the first letter capitalized
    startData() { return {
        unlocked: false, 
		points: new Decimal(0),
    }},
    color: "#AA4A44", // Can be a function that takes requirement increases into account
    resource: "Bricks",
    position: 1,
    row: 1, // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points},
    requires: new Decimal(300), // Get the current amount of baseResource
    type: "static",
    branches: ["p"], // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1.25, // Prestige currency exponent
    gainMult() {
        mult = new Decimal(1)

        return mult 
    }, // Calculate the multiplier for main currency from bonuses
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    }, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "b", description: "B: Reset for bricks", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    effect() {
        eff = player[this.layer].points.add(1).pow(0.7)
        return eff
        },
    effectDescription() {
        eff = this.effect();
        return "which is boosting your point gain by "+format(eff)

    }, 

    layerShown(){
        if (hasAchievement("a",11)) return true
    },

    upgrades: {
        11: {
            title: "Power point gain",
            description: "Powers point gain by 1.2",
            cost: 1
        }, 
    },
})

addLayer("a", {
    startData() { return {
        unlocked: true,
    }},
    color: "#FFFF00",
    row: "side",

    layerShown() {return true},
    tooltip(){
        return ("Achievements")
    },
    tabFormat: [
        ["display-text",
          function() {return `You found ${player.a.achievements.length} Achievements` },
          {"font-size": "32px"}],
        "blank",
        "blank",
        "blank",
        "blank",
        "achievements",
    ],

    achievements: {
        11: {
            name: "First Upgrade",
            done() {
                return (hasUpgrade("p",11))
            },
            goalToolTip() { return "Get the first upgrade"},

            doneToolTip() { return "Your getting there"},
        },
    },
})
