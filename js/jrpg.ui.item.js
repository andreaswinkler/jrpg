/*
** 2014/02/12
*/
JRPG.UI.Item = function(item) {

    this.stack = item instanceof JRPG.Inventory.Stack ? item : null;
    this.item = this.stack != null ? stack.items[0] : item;
    
    this.e = null;
    this.tooltip = null;
    
    this.initItem = function() {
    
        this.e = $('<div class="jrpg-ui-item rank-' + this.item.rank + '"><img src="tex/ui-' + this.item.type + '.png" class="jrpg-ui-item-img" /><div class="jrpg-ui-item-sockets"></div></div>');

        this.e.mouseenter($.proxy(function(ev) {
        
            var position = $(ev.target).closest('.jrpg-ui-item').offset();
        
            this.showTooltip(position.left, position.top);    
        
        }, this));  
        
        this.e.mouseleave($.proxy(function(ev) {
        
            this.hideTooltip();
        
        }, this));  
    
    };
    
    this.initTooltip = function() {
    
        this.tooltip = new JRPG.UI.ItemTooltip(this.item);
    
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
JRPG.UI.ItemTooltip = function(stack) {

    this.stack = stack;
    this.item = this.stack.items ? this.stack.items[0] : stack;
    
    this.e = null;
    
    this.initItemTooltip = function() {
    
        var s = '';
        
        s += '<div class="jrpg-ui-item-tooltip rank-' + this.item.rank + '">';
        // thumbnail
        s += '<div class="thumb">';
        s += '<img src="tex/ui-' + this.item.type + '.png" class="jrpg-ui-item-img" />';
        s += '</div>';
        // title
        s += '<strong>' + this.item.name + '</strong>';
        s += '<span class="slot">' + '1-hand' + '</span>';
        s += '<p class="attributes">';
        
        if (this.item.isWeapon) {
        
            s += '<span class="dps">' + this.item.dps() + '</span> dps<br />';
            s += '<label>Damage:</label> ' + this.item.attr('minDmg') + '-' + this.item.attr('maxDmg') + '<br />';
            s += '<label>Speed: </label>' + this.item.attr('attackSpeed');    
        
        } else if (this.item.isArmor) {
        
            s += '<span class="dps">' + this.item.attr('armor') + '</span> armor<br />';
            
            if (this.item.baseType == 'bt_shield') {
            
                s += '<label>Block amount:</label> ???<br />';
                s += '<label>Block chance:</label> 10%';    
            
            }
        
        }
        
        s += '</p>';
        
        s += '<p class="modifiers"></p>';
        
        s += '<span class="level">Level 1</span>';
        s += '<span class="durability">Durability ' + this.item.durability + '/10' + '</span>';
        
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