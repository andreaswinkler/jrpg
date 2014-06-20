/*
** 2014/02/12
** 
** represents all complex creatures like the hero, vendors, blacksmith, 
** jeweller and all npcs
*/
JRPG.Character = function(type, name, level) {

    // the inventories of the character
    // hero: inventory and stash (bags maybe)
    // vendor: multiple inventories for armor, weapons and misc
    this.inventories = null;
    
    // the current experience value of the character
    this.xp = 0;
    
    // the amount of gold the character posesses
    this.gold = 0;
    
    // the type of the character
    this.type = '';
    
    // are we hero?
    this.isHero = false;

    /*
    ** initialize the character by creating a basic creature of 
    ** rank 'normal' and setup the inventories based on the character
    ** type        
    */    
    this.initCharacter = function(type, name, level) {

        this.initCreature(type, name, level, JRPG.Creature.Rank.NORMAL);
        
        this.inventories = {};
        
        switch (this.type) {
        
            case 'hero':
            
                this.inventories.main = new JRPG.Inventory(this, 10, 6);
                this.inventories.stash0 = new JRPG.Inventory(this, 10, 20);
                
                this.equipment.on('unequip', function(ev) {

                    // try to add the item to the inventory
                    this.inventories.main.addItem(ev.data.item); 
                
                }, this);
                
                this.attr('pickupRange', 1);
                
                this.isHero = true;
                
                break;
            
            case 'vendor':
            
                this.inventories.armor = new JRPG.Inventory(this, 10, 20);
                this.inventories.weapons = new JRPG.Inventory(this, 10, 20);
                this.inventories.misc = new JRPG.Inventory(this, 10, 20);
                
                break;

        }
    
    };
    
    this.characterLoop = function(ticks) {
    
        this.creatureLoop(ticks);
    
    };
    
    this.loop = function(ticks) {
    
        this.characterLoop(ticks);
    
    };
    
    /*
    ** get the experience value necessary to reach the next level
    */    
    this.nextLevelXp = function() {
    
        return this.levelXp(this.level + 1);
    
    };
    
    /*
    ** get the experience progress within the current level
    */    
    this.currentLevelXp = function() {
    
        return this.levelXp(this.level);        
    
    };
    
    /*
    ** get the experience value necessary to reach a given level
    ** -1 is returned in case the level is not defined    
    */    
    this.levelXp = function(level) {
    
        return JRPG.Object.data[this.type] && JRPG.Object.data[this.type].levels && JRPG.Object.data[this.type].levels[level - 1] != undefined ? JRPG.Object.data[this.type].levels[level - 1] : -1;
    
    };
    
    /*
    ** perform a level up
    ** increase the level property and emit an event    
    */
    this.levelUp = function() {
    
        this.level += 1;
        
        this.emit('levelUp');
    
    };
    
    /*
    ** increase the experience value by a given amount
    ** if this would reach the next level, perform a level up    
    */    
    this.addXp = function(amount) {
    
        this.xp += amount;
        
        if (this.xp >= this.nextLevelXp()) {
        
            this.levelUp();
        
        }    
    
    };
    
    /*
    ** increase the mastery xp
    */    
    this.addMasteryXp = function(mastery, amount) {
    
        this.masteries[mastery] += amount;
    
    }
    
    /*
    ** increase the amount of gold
    ** raises an event    
    */    
    this.addGold = function(amount) {
    
        this.gold += amount;
        
        this.emit('goldChanged');
    
    };
    
    /*
    ** decreases the amount of gold
    ** raises an event    
    */    
    this.removeGold = function(amount) {
    
        this.gold -= amount;
        
        this.emit('goldChanged');
    
    };
    
    /*
    ** pick up items or gold
    **          
    */
    this.pickUp = function(item) {
    
        if (item instanceof JRPG.Gold) {
        
            this.addGold(item.amount);
        
        } else {
        
            this.inventories.main.addItem(item);
        
        }
    
    };

    /*
    ** check if the character can afford a given invoice
    ** invoice: a list of key/value pairs (item type and amount)
    ** the character is tested for gold and items in its inventory        
    */
    this.canAfford = function(invoice) {
    
        var success = true;
    
        _.each(invoice, function(i, key) {
        
            switch (key) {
            
                case 'gold':
                
                    if (this.gold < i) {
                    
                        success = false;
                    
                    }
                
                    break;
                
                default:
                
                    if (!(this.inventories.main && this.inventories.main.containsItem(key, i))) {
                    
                        success = false;    
                    
                    }
                    
                    break;
            
            }
        
        }, this);
        
        return success;    
    
    };
    
    /*
    ** remove the items or reduce the amount of gold based on the 
    ** given invoice
    ** at the beginning it always checks if the character can afford the 
    ** invoice            
    */    
    this.pay = function(invoice) {
     
        if (this.canAfford(invoice)) {
        
            _.each(invoice, function(i, key) {
            
                switch (key) {
                
                    case 'gold':
                    
                        this.removeGold(i);
                        
                        break;
                    
                    default: 
                    
                        this.inventories.main.removeItem(key, i);
                    
                        break;
                
                }   
            
            }, this);
        
            return true;    
        
        }
        
        return false;
    
    };
    
    /*
    ** returns the combined repair costs of all items the hero posesses
    ** TODO: how to deal with the stash inventory???    
    */    
    this.repairCost = function() {
    
        return _.reduce(this.items, function(memo, i) { return memo + i.repairCost(); }, 0);
    
    };
    
    /*
    ** repairs all items the hero posesses
    ** TODO: again, how to deal with the stash?    
    */    
    this.repairAll = function() {
    
        var totalRepairCost = this.repairCost(), 
            invoice = { gold: totalRepairCost };
        
        if (totalRepairCost > 0) {
        
            if (this.canAfford(invoice)) {
            
                _.invoke(this.items, 'repair');
                
                this.pay(invoice);
                
                return true;
            
            }
        
        }
        
        return false;
    
    }
    
    this.initCharacter(type, name, level);

};
JRPG.Character.prototype = new JRPG.Creature();