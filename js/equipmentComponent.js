var EquipmentComponent = function(entity, settings) {

    this.slots = {
    
        headgear: null, 
        chestarmor: null, 
        gloves: null, 
        boots: null, 
        pants: null, 
        amulet: null, 
        ring1: null, 
        ring2: null, 
        weapon1: null, 
        offhand1: null, 
        weapon2: null, 
        offhand2: null, 
        belt: null, 
        token1: null, 
        token2: null, 
        token3: null
    
    };
    
    this.activeWeaponSlot = settings.activeWeaponSlot || 0; 
    
    /*
    ** switches between primary and secondary weapon slot
    */     
    this.toggleWeaponSlot = function() {
    
        this.activeWeaponSlot = this.activeWeaponSlot == 0 ? 1 : 0;
    
    };

    /*
    ** removes the item from a given slot and returns it
    **
    ** Events raised by this method:
    **    onUnequip (an item was successfully unequipped from the given slot)            
    */    
    this.unequip = function(item) {
    
        var slot = this.getItemSlot(item);
    
        if (slot != null) {
    
            this.slots[slot] = null;
        
        }
        
        return item;
    
    };
    
    /*
    ** returns the slot for a given item or null if the item
    ** is not equipped
    */
    this.getItemSlot = function(item) {
    
        var slot = null;
                
        _.each(this.slots, function(value, key) {

            if (value == item) {
                
                slot = key;
                
            }
        
        }, this);
        
        return slot;    
    
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
        
            if (this.slots[slot] != null) {
            
                replacedItem = this.slots[slot]; 
            
            }
            
            this.slots[slot] = item;
            
            // set the owner of the item to the owner of the 
            // equipment
            item.owner = this.owner;
            
            return replacedItem;
        
        }

        return item;
    
    }; 
    
    this.sum = function(modifier) {
    
        return _.reduce(this.slots, function(memo, item) {
        
            if (item) {
            
                return memo + item.sum(modifier);
            
            }
            
            return memo;
        
        }, 0, this);
    
    }; 
    
    /*
    ** returns the corresponding slot for a given itemType
    */    
    this.getSlot = function(itemType) {
    
        for (var slot in EquipmentComponent.slotRestrictions) {
    
            if (_.contains(EquipmentComponent.slotRestrictions[slot], itemType)) {
        
                return slot;
        
            }
    
        }
    
        return undefined;    
    
    };    

}

EquipmentComponent.slotRestrictions = {
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