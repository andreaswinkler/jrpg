/*
** 2014/02/12
*/
JRPG.UI.Item = function(item, equipped) {

    this.stack = item instanceof JRPG.Inventory.Stack ? item : null;
    this.item = this.stack != null ? stack.items[0] : item;
    this.equipped = equipped;
    
    this.e = null;
    this.tooltip = null;
    
    this.initItem = function() {
    
        var s = '';
    
        this.e = $('<div class="jrpg-ui-item rank-' + this.item.rank + '"><img src="tex/ui-' + this.item.type + '.png" class="jrpg-ui-item-img" /></div></div>');

        if (this.item.hasSockets()) {

            s += '<div class="sockets sockets-' + this.item.sockets.length + '">';
       
            _.each(this.item.sockets, function(v, ind) {
            
                s += '<span class="socket socket-' + ind + '">';
                
                if (v != null) {
                
                    // insert something
                
                }
                
                s += '</span>';
            
            }, this);
       
            s += '</div>';
            
            this.e.append(s);
        
        }

        this.e.mouseenter($.proxy(function(ev) {
        
            var position = $(ev.target).closest('.jrpg-ui-item').offset();
        
            this.showTooltip(position.left, position.top);    
        
        }, this));  
        
        this.e.mouseleave($.proxy(function(ev) {
        
            this.hideTooltip();
        
        }, this));  
    
    };
    
    this.initTooltip = function() {
    
        this.tooltip = new JRPG.UI.ItemTooltip(this.item, this.equipped);
    
    };
    
    this.showTooltip = function(x, y) {
        
        if (!this.tooltip) {
        
            this.initTooltip();
        
        }
        
        this.tooltip.show(x, y);
    
    };
    
    this.hideTooltip = function() {
        
        if (this.tooltip) {
        
            this.tooltip.hide();
        
        }
    
    };
    
    this.initItem();

}

/*
** 2014/02/12
*/
JRPG.UI.ItemTooltip = function(item, equipped) {

    this.item = item;
    this.equipped = equipped;
    this.title = equipped ? 'Equipped' : '';
    
    this.e = null;
    
    this.modifier = function(key, value) {
    
        switch (key) {
        
            case 'int':
            
                return '+' + value + ' to Focus';
            
            case 'str':
            
                return '+' + value + ' to Strength';
                
            case 'vit':
            
                return '+' + value + ' to Vitality';
                
            case 'dex':
            
                return '+' + value + ' to Dexterity';
                
            case 'critChance':
            
                return '+' + value + '% critical hit chance';
            
            case 'openWounds':
            
                return '+' + value + '% chance to cause Open Wounds';
            
            case 'minDmg':
            
                return '+' + value + ' minimum damage';
            
            case 'maxDmg':
            
                return '+' + value + ' maximum damage';
                
            case 'crushingBlow':
            
                return '+' + value + '% chance for Crushing Blow';
            
            case 'sockets':
            
                return 'Sockets (' + value + ')';
            
            case 'attackSpeed':
            
                return '+' + value + '% increased attack speed';
            
            case 'critDmg':
            
                return '+' + value + '% critical hit damage';
              
        
        }
    
        return key + ': ' + value;
    
    };
    
    this.initItemTooltip = function() {
    
        var s = '', 
            minDmg, maxDmg;
        
        s += '<div class="jrpg-ui-item-tooltip rank-' + this.item.rank + '">';
        
        // title
        s += '<span class="title">' + this.title + '</span>';
        
        // thumbnail
        s += '<div class="thumb">';
        s += '<img src="tex/ui-' + this.item.type + '.png" class="jrpg-ui-item-img" />';
        
        if (this.item.hasSockets()) {
        
            s += '<div class="sockets sockets-' + this.item.sockets.length + '">';
       
            _.each(this.item.sockets, function(v, ind) {
            
                s += '<span class="socket socket-' + ind + '">';
                
                if (v != null) {
                
                    // insert something
                
                }
                
                s += '</span>';
            
            }, this);
       
            s += '</div>';
            
        }
      
        s += '</div>';
        // title
        s += '<strong>' + this.item.name + '</strong>';
        s += '<span class="slot">' + '1-hand' + '</span>';
        s += '<p class="attributes">';
        
        if (this.item.isWeapon) {
        
            minDmg = this.item.attr('minDmg');
            maxDmg = this.item.attr('maxDmg');
        
            s += '<span class="dps">' + this.item.dps().toFixed(2) + '</span> dps<br />';
            s += '<label>Damage:</label> ' + (minDmg != maxDmg ? minDmg + '-' + maxDmg : minDmg) + '<br />';
            s += '<label>Speed: </label>' + this.item.attr('attackSpeed').toFixed(2);    
        
        } else if (this.item.isArmor) {
        
            s += '<span class="dps">' + this.item.attr('armor') + '</span> armor<br />';
            
            if (this.item.baseType == 'bt_shield') {
            
                s += '<label>Block amount:</label> ???<br />';
                s += '<label>Block chance:</label> 10%';    
            
            }
        
        }
        
        s += '</p>';
        
        s += '<p class="modifiers">';
        
        _.each(this.item.modifiers, function(value, key) {
        
            s += this.modifier(key, value) + '<br />';
        
        }, this);
        
        s += '</p>';
        
        s += '<span class="level">Level 1</span>';
        s += '<span class="durability">Durability ' + this.item.durability + '/10' + '</span>';
        
        s += '<hr />';
        
        // actions
        s += '<div class="actions">';
        
        if (!this.equipped) {
        
            s += '<input type="button" class="mouse-left" value="" />';
        
        }
        
        s += '<input type="button" class="mouse-right" value="unequip" />';
        s += '</div>';
        
        s += '</div>';
    
        this.e = $(s);
        
        $('#jrpg_ui').append(this.e);
    
    };
    
    this.hide = function() {
    
        this.e.addClass('hidden');
    
    };
    
    this.show = function(x, y) {
        
        x = x - this.e.width();
        
        this.e
            .css('left', x + 'px')
            .css('top', y + 'px')
            .removeClass('ui-sell, ui-salvage, ui-normal, ui-repair')
            .addClass('ui-' + JRPG.UI.getMode())
            .removeClass('hidden');
    
    };
    
    this.initItemTooltip();    

}