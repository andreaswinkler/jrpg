/*
** 2014/02/12
*/
JRPG.UI.Inventory = function(inventory, p) {

    this.inventory = inventory;
    
    this.e = null;
    
    this.initInventory = function(p) {
    
        this.e = $('<div class="inventory-grid"></div>');
        
        p.append(this.e);
    
    }
    
    this.initInventory(p);

}