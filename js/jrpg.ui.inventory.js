/*
** 2014/02/12
*/
JRPG.UI.Inventory = function(inventory) {

    this.inventory = inventory;
    
    this.e = null;
    
    this.initInventory = function() {
    
        this.e = $('<div class="inventory-grid"></div>');
    
    }
    
    this.initInventory();

}