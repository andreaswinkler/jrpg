/*
** 2014/02/12
*/
JRPG.UI.Equipment = function(equipment, p) {

    this.equipment = equipment;
    
    this.e = null;
    this.ePrimary = null;
    this.eSecondary = null;
    
    this.initEquipment = function(p) {
    
        var s = '', 
            slot;
        
        for (slot in JRPG.Equipment.slots) {
        
            s += '<div class="equipment-item ' + slot + '" data-slot="' + slot + '"></div>';    
        
        }
        
        this.e = p;
        
        p.append(s);
        
        this.ePrimary = this.e.find('.weapon1, .offhand1');
        this.eSecondary = this.e.find('.weapon2, .offhand2');
        
        this.equipment.on('weaponSlotChanged', this.updateWeaponSlots, this);

        // toggle weapon slots and add all items from the 
        // equipment
        this.update();
    
    };
    
    this.tooltip = function(ev) {
    
        var e = $(ev.target);
        
        JRPG.UI.showTooltip();
    
    };
    
    this.hideTooltip = function(ev) {
    
    };
    
    this.updateWeaponSlots = function() {
    
        if (this.equipment.primaryWeaponSlot) {
        
            this.eSecondary.addClass('hidden');
            this.ePrimary.removeClass('hidden');
        
        } else {
        
            this.ePrimary.addClass('hidden');
            this.eSecondary.removeClass('hidden');
        
        }    
    
    };
    
    this.update = function() {
        
        var slot;
        
        this.updateWeaponSlots();
        
        for (slot in this.equipment) {
        
            if (this.equipment[slot] instanceof JRPG.Item) {

                this.e.find('.' + slot)
                    .html(new JRPG.UI.Item(this.equipment[slot], true).e);              
            
            } else if (this.equipment[slot] == null) {
            
                this.e.find('.' + slot)
                    .html('')
                    .unbind();
            
            }
        
        }   
    
    };
    
    this.initEquipment(p);

}