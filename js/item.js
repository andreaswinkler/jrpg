/* CLASS GOLD
** 2014-01-31
**
** represents a pile of gold
*/
var Gold = function(amount) {

    this.amount = amount;
    this.type = 'gold';
    this.name = this.amount + ' Gold';

}

/* CLASS ITEM
** 2014-01-29
**
** represents an item
*/
var Item = function(type, level, rank) {

    this.sum = function(modifier) {
    
        var value = 0;
    
        // check modifiers and sockets
        if (this.modifiers[modifier]) {
        
            value += this.modifiers[modifier];
        
        }
        
        if (this.attributes[modifier]) {
        
            value += this.attributes[modifier];
        
        }
        
        return value;
    
    };

    /*
    ** calculates the value of an attribute (key) using the attribute 
    ** modifiers of the equipped item
    ** the passed value is the value the attribute had before the 
    ** item is processed            
    */
    this.attr = function(key, value) {
    
        var v = 0, 
            isPercentAttribute = key.length > 4 && key.substring(0, 4) == 'perc';
    
        if (this.attributes[key]) {
        
            if (isPercentAttribute) {
            
                v += v * this.attributes[key];
            
            } else {
            
                v += this.attributes[key];
          
            }
        
        } 
        
        if (this.modifiers[key]) {
        
            if (key == 'attackSpeed') {
            
                v += v * (this.modifiers[key] / 100);
            
            } else {
        
                v += this.modifiers[key];
            
            }
        
        } 
        
        if (key == 'maxDmg') {
        
            v = Math.max(v, this.attr('minDmg'));
        
        } 
        
        return v;
    
    };
    
    this.score = function() {
    
        return this.rank == 10 ? 0 : this.rank;
    
    };
    
    /*
    ** adds a modifier
    */
    this.addModifier = function(key, value) {
    
        var i;
    
        if (this.modifiers[key]) {
        
            this.modifiers[key] += value;
        
        } else {
        
            this.modifiers[key] = value;
        
        }  
        
        if (key == 'sockets') {
        
            for (i = 0; i < value; i++) {
            
                this.sockets.push(null);
            
            }    
        
        } 
    
    };
    
    this.addModifiers = function(set) {
    
        for (var key in set) {
        
            this.addModifier(key, _.random(set[key][0], set[key][1]));
        
        }
    
    }; 
    
    this.repairCost = function() {
    
        return this.durability != -1 ? (10 - this.durability) * this.rank * this.level : 0;
    
    };   
    
    this.repair = function() {
    
        if (this.durability != -1) {
        
            this.durability = 10;
        
        }
    
    };  
    
    this.hasSockets = function() {
    
        return this.sockets.length > 0;
    
    };   
    
    this.dps = function() {
    
        var dps = 0;
        
        if (this.superType == 'st_weapon') {
        
            return (this.attr('minDmg') + this.attr('maxDmg')) / 2 * this.attr('attackSpeed');
        
        }
        
        return dps;
    
    };  

    var data = Item.data[type] || {};

    // the owner of the item
    this.owner = null;

    // the type of the item (e.g. shortsword, woodenbow, chippedruby, etc)
    this.type = type;
    
    // the name of the item
    this.name = data.name;
    
    // the level of the item
    this.level = level;
    
    // the current jrpg version when the item is created
    //this.version = version;
    
    // the base type of the item (e.g. weapon, chestarmor, ruby, etc)
    this.baseType = data.baseType || 'unknown';
    
    // the super type of the item (e.g. onehandweapon, armor, jewelry, gem, rune, etc)
    this.superType = data.superType || 'unknown';
    
    // the item category (e.g. weapon, armor, jewelry, socketable)
    this.itemCategory = data.category || 'unknown';
    
    // the rank of the item (normal, magic, rare, set, legendary)
    this.rank = rank;
    
    // the durabiliy of the item
    this.durability = data.durability != -1 ? _.random(8, 10) : -1;
    
    // the base attributes of the item (damage, armor)
    this.attributes = Item.attributesFromData(data);
    
    // the modifiers of the item
    this.modifiers = data.modifiers || {}; 
    
    // if the item is part of a set, this is set to the set name/key
    this.set = '';
    
    // the inventory space the item takes
    this.inventoryWidth = data.inventoryWidth;
    this.inventoryHeight = data.inventoryHeight;
    
    // the maximum amount of items of this type than can be stacked
    this.maxStackAmount = data.maxStackAmount;
    
    // is the item etheral?
    this.isEtheral = false;
    
    this.isWeapon = this.superType == 'st_weapon';
    this.isArmor = this.superType == 'st_armor';
    this.isJewellery = this.superType == 'st_jewellery';
    
    // do we have sockets
    this.sockets = [];
    
    // we want a legendary or set so we need to check if one exists for this 
    // type at all, if not we reduce the item rank to rare
    if (this.rank == Item.Rank.LEGENDARY) {
    
        var legendaries = data.legendaries ? data.legendaries.filter($.proxy(function(i) { return this.level >= i.minLevel; }, this)) : [];
    
        if (legendaries.length > 0) {
        
            var legendary = legendaries.random(); 
            
            this.name = legendary.name;
            
            this.addModifiers(legendary.modifiers);       
        
        } else {
        
            this.rank = Item.Rank.SET;
        
        }        
    
    }
    
    if (this.rank == Item.Rank.SET) {
    
        var setPieces = data.setPieces ? data.setPieces.filter($.proxy(function(i) { return this.level >= i.minLevel; }, this)) : [];
        
        if (setPieces.length > 0) {
        
            var setPiece = setPieces.random();
            
            this.name = setPiece.name;
            this.set = setPiece.set;
            
            this.addModifiers(setPiece.modifiers);   
        
        } else {
        
            this.rank = Item.Rank.RARE;
        
        }
    
    }
        
    // modify the item based on the rank
    switch (this.rank) {
    
        case Item.Rank.MAGIC: 
        
            var preOrSuffix = _.random(1, 3);
            
            // if we have a prefix or prefix AND suffix
            if (preOrSuffix == 1 || preOrSuffix == 3) {
            
                Item.addPrefix(this);
            
            }
            
            // if we have suffix or prefix AND suffix
            if (preOrSuffix == 2 || preOrSuffix == 3) {
            
                Item.addSuffix(this);
            
            }
        
            break;
        
        case Item.Rank.RARE:
        
            var amount = _.random(3, 5);
            
            Item.addPreSuffixes(this, amount);
        
            this.name = Item.data[this.baseType].rareNames1.random() + ' ' + Item.data[this.baseType].rareNames2.random();
        
            break;
        
        case Item.Rank.NORMAL:
        
            // some normal items have a chance to be etheral
            // which increases their base attributes
            if (data.etheralChance && Math.random() <= data.etheralChance) {
            
                _.each(['armor', 'minDmg', 'maxDmg'], function(i) {
                
                    if (this.attributes[i]) {
                    
                        this.attributes[i] = Math.floor(this.attributes[i] * 1.5);
                    
                    }
                
                }, this);
            
            
                this.attributes.etheral = true;  
            
            }
        
            break;
    
    }

}

Item.Rank = {

    NORMAL: 0, 
    MAGIC: 1,
    RARE: 2,
    SET: 3,
    LEGENDARY: 4,
    UNRANKED: 10

}

Item.attributesFromData = function(data) {

    var attributes = {}, 
        attrib, v;

    if (data.attributes) {
    
        for (attrib in data.attributes) {
        
            v = data.attributes[attrib];
        
            attributes[attrib] = _.random(v[0], v[1]);
        
        }
    
    }
    
    return attributes;

}

Item.preSuffixesByLevel = function(itemBaseType, itemLevel, prefixes, suffixes) {

    var d = Item.data[itemBaseType], 
        i, fix, list = [], src = [];

    if (d) {
    
        if (prefixes && d.prefixes) {
        
            src = src.concat(d.prefixes);
        
        }
        
        if (suffixes && d.suffixes) {
        
            src = src.concat(d.suffixes);
        
        }
        
        for (i = 0; i < src.length; i++) {
        
            fix = src[i];
            
            if (itemLevel >= fix.minLevel && itemLevel <= fix.maxLevel) {
            
                list.push(fix);
            
            }
        
        }
    
    }
    
    return list;

}

Item.addPrefix = function(item) {

    var prefix = Item.preSuffixesByLevel(item.baseType, item.level, true, false).random();
    
    if (prefix != null) {
    
        item.addModifiers(prefix.modifiers);
    
        item.name = prefix.name + ' ' + item.name;
    
    }

}

Item.addSuffix = function(item) {

    var suffix = Item.preSuffixesByLevel(item.baseType, item.level, false, true).random();
    
    if (suffix != null) {
    
        item.addModifiers(suffix.modifiers);
        
        item.name = item.name + ' ' + suffix.name;
    
    }

}

Item.addPreSuffixes = function(item, amount) {

    var preSuffixes = Item.preSuffixesByLevel(item.baseType, item.level, true, true).random(amount), 
        i;
    
    if (preSuffixes) {
    
        for (i = 0; i < preSuffixes.length; i++) {
        
            item.addModifiers(preSuffixes[i].modifiers);
        
        }
    
    }

}

Item.data = null;