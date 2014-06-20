/*
** 2014/02/12
*/
JRPG.UI.Inventory = function(inventory, p) {

    this.inventory = inventory;
    
    this.e = null;
    
    this.initInventory = function(p) {
    
        this.e = $('<div class="inventory-grid"></div>');
        
        p.append(this.e);
        
        this.inventory.on('update', this.update, this);
    
    };
    
    this.update = function() {
    
        this.e.html('');
    
        _.each(this.inventory.stacks, function(i) {
        
            var cell = i.cells[0];
            
            this.e.append(new JRPG.UI.Item(i.items[0]).e);
        
        }, this);
    
    };
    
    this.initInventory(p);

}