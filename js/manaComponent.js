var ManaComponent = function(entity, settings) {

    // the maximum mana
    this.total = settings.total || 0; 
    
    // the current mana
    this.current = settings.current || this.total;
    
    // how fast does mana regenerate?
    this.manaPerSecond = settings.lifePerSecond || 0;
    
    this.loop = function(ticks) {
    
        this.update(this.current + this.manaPerSecond * ticks / 1000); 
    
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