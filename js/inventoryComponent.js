var InventoryComponent = function(entity, settings) {

    this.inventories = {};
    
    if (settings.inventories) {
    
        _.each(settings.inventories, function(value, key) {
        
            this.inventories[key] = new Inventory(value.width, value.height);
        
        }, this);
    
    }

}