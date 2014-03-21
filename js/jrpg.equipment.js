/* CLASS EQUIPMENT
** 2014-01-28
**
** represents the equipment slots of a creature or hero and handles 
** equip/unequip of weapons, armors and jewelry
** furthermore the class calculates attribute modifiers through all 
** equipped items and handles weapon switches
*/
JRPG.Equipment = function(owner) {

    // the owner of the equipment (usally the hero or a human creature)
    this.owner = owner;

    // the equipment slots
    this.headgear = null;
    this.chestarmor = null;
    this.gloves = null;
    this.boots = null;
    this.pants = null;
    this.amulet = null;
    this.ring1 = null;
    this.ring2 = null;
    this.weapon1 = null;
    this.offhand1 = null;
    this.weapon2 = null;
    this.offhand2 = null;
    this.belt = null;
    this.token1 = null;
    this.token2 = null;
    this.token3 = null;
    
    // primaryWeaponSlot = true means the first weapon slot is used
    this.primaryWeaponSlot = true;
    
    /*
    ** switches between primary and secondary weapon slot
    */     
    this.toggleWeaponSlot = function() {
    
        this.primaryWeaponSlot = !this.primaryWeaponSlot;
        
        this.emit('weaponSlotChanged');
        this.emit('statChanged')
    
    };
    
    /*
    ** returns the corresponding slot for a given itemType
    */    
    this.getSlot = function(itemType) {
    
        for (var slot in JRPG.Equipment.slots) {
    
            if (_.contains(JRPG.Equipment.slots[slot], itemType)) {
        
                return slot;
        
            }
    
        }
    
        return undefined;    
    
    };
    
    /* 
    ** places an item in its corresponding slot
    ** if no slot is found the item is returned
    **  if the item could be equipped and it replaced another item, the 
    **    replaced item is returned
    **
    ** Events raised by this method:
    **    onItemReplaced (an item was replaced by the newly equipped one)
    **    onEquip (the passed item was successfully equipped)
    **    onEquipError (the item could not be equipped because no slot was
    **                  found)                    
    */    
    this.equip = function(item) {
    
        var slot = this.getSlot(item.baseType), 
            replacedItem = null;
        
        if (slot) {
        
            if (this[slot] != null) {
            
                replacedItem = this[slot]; 
                
                this.emit('onItemReplaced', { item: item });
            
            }
            
            this[slot] = item;
            
            // set the owner of the item to the owner of the 
            // equipment
            item.owner = this.owner;
            
            this.emit('onEquip', { item: item, slot: slot });
            
            return replacedItem;
        
        }
        
        this.emit('onEquipError', { item: item });
        
        return item;
    
    };
    
    /*
    ** removes the item from a given slot and returns it
    **
    ** Events raised by this method:
    **    onUnequip (an item was successfully unequipped from the given slot)            
    */    
    this.unequip = function(slot) {
    
        var item = this[slot];
        
        this[slot] = null;
        
        if (item != null) {
        
            this.emit('onUnequip', { item: item, slot: slot })
        
        }
        
        return item;
    
    };
    
    /*
    ** calculates the value of an attribute (key) using the attribute 
    ** modifiers of all equipped items
    ** the passed value is the value the attribute had before the 
    ** equippment is processed            
    */    
    this.attr = function(key, value) {
    
        var equipment = this.getList();
        
        for (item in equipment) {
        
            value += this[item].attr(key, value);
        
        }
    
        return value;  
    
    };
    
    /*
    ** returns the equipped and active weapon if any
    */
    this.getWeapon = function() {
    
        return this.primaryWeaponSlot ? this.weapon1 : this.weapon2;
    
    };
    
    /*
    ** returns the current equipment based on the primaryWeaponSlot status
    */
    this.getList = function() {
    
        var equipment = {};
        
        _.each(this, function(item, slot) {
        
            if (item instanceof JRPG.Item) {
            
                if (!((this.primaryWeaponSlot && (slot == 'weapon2' || slot == 'offhand2')) || 
                     (!this.primaryWeaponSlot && (slot == 'weapon1' || slot == 'offhand1')))) 
                {
                
                    equipment[slot] = item;
                
                }
            
            }
        
        }, this);
        
        return equipment;
    
    };         

}
JRPG.Equipment.prototype = new JRPG.EventHandler();

JRPG.Equipment.slots = {
    headgear: ['bt_helm'], 
    chestarmor: ['bt_armor'], 
    gloves: ['bt_gloves'], 
    boots: ['bt_boots'], 
    pants: ['bt_pants'], 
    amulet: ['bt_amulet'], 
    ring1: ['bt_ring'], 
    ring2: ['bt_ring'], 
    weapon1: ['bt_sword', 'bt_bow', 'bt_staff'], 
    weapon2: ['bt_sword', 'bt_bow', 'bt_staff'], 
    offhand1: ['bt_quiver', 'bt_sword', 'bt_shield'], 
    offhand2: ['bt_quiver', 'bt_sword', 'bt_shield'], 
    belt: ['bt_belt'], 
    token1: ['bt_token'], 
    token2: ['bt_token'], 
    token3: ['bt_token']
}