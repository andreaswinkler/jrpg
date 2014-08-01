var ManaComponent = function(entity, settings) {

    this._e = entity;
    this._settings = settings;

    // the maximum mana
    this.total = settings.total || 0; 
    
    // the current mana
    this.current = settings.current || this.total;
    
    // how fast does mana regenerate?
    this.manaPerSecond = settings.lifePerSecond || 0;
    
    this.loop = function(ticks) {
    
        this.update(this.current + this.manaPerSecond * ticks / 1000); 
    
    };

    this.refresh = function() {
    
        this.manaPerSecond = this._settings.manaPerSecond;
        this.total = this._settings.total;
        
        if (this._e.EquipmentComponent) {
        
            this.manaPerSecond += this._e.EquipmentComponent.sum('manaPerSecond');
            this.manaPerSecond *= 1 + this._e.EquipmentComponent.sum('manaPerSecondPercent');
        
        } 
        
        if (this._e.StatsComponent) {
        
            this.total = this._e.StatsComponent.intelligence * 10;
        
        }   
    
    };

    // spend x amount of mana, returns false if there is not enough
    this.spend = function(amount) {
    
        if (this.current >= amount) {
        
            this.update(this.total - amount);
            
            return true;
        
        }
        
        return false;
    
    }

    // sets the mana to a new value within 0 and total
    this.update = function(newCurrentValue) {
    
        this.current = Math.max(0, Math.min(newCurrentValue, this.total));
    
    }; 

}