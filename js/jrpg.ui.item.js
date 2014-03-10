/*
** 2014/02/12
*/
JRPG.UI.Item = function(item) {

    this.stack = item instanceof JRPG.Inventory.Stack ? item : null;
    this.item = this.stack != null ? stack.items[0] : item;
    
    this.e = null;
    this.tooltip = null;
    
    this.initItem = function() {
    
        this.e = $('<div class="jrpg-ui-item rank-' + this.item.rank + '"><img src="" class="jrpg-ui-item-img" /><div class="jrpg-ui-item-sockets"></div></div>');
        
        this.e.mouseenter($.proxy(function(ev) {
        
            this.showTooltip();    
        
        }, this));    
    
    };
    
    this.initTooltip = function() {
    
        this.tooltip = new JRPG.UI.ItemTooltip(this.item);
    
    };
    
    this.showTooltip = function() {
    
        if (!this.tooltip) {
        
            this.tooltip = this.initTooltip();
        
        }
        
        this.tooltip.show();
    
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
    this.item = this.stack.items[0];
    
    this.e = null;
    
    this.initItemTooltip = function() {
    
        this.e = $('<div class="jrpg-ui-item-tooltip"><img src="" class="img" /><span class="title"></span></div>');
    
    };
    
    this.hide = function() {
    
        this.e.addClass('hidden');
    
    };
    
    this.show = function() {
    
        this.e.removeClass('ui-sell, ui-salvage, ui-normal, ui-repair');
        
        this.e.addClass('ui-' + JRPG.UI.getMode());
    
        this.e.removeClass('hidden');
    
    };
    
    this.initItemTooltip();    

}