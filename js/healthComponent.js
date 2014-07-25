var HealthComponent = function(entity, settings) {

    this._e = entity;

    // the maximum health
    this.total = settings.total || 0; 
    
    // the current health
    this.current = settings.current || this.total;
    
    // how fast does life regenerate?
    this.lifePerSecond = settings.lifePerSecond || 0;
    
    // the death/destruction timestamp
    this.tsDeath = undefined;
    
    this.loop = function(ticks) {
    
        this.update(this.current + this.lifePerSecond * ticks / 1000); 
    
    };

    // sets the health to a new value within 0 and total
    // in case the value is set to null, an entityDestroyed event is raised
    this.update = function(newCurrentValue) {
    
        this.current = Math.max(0, Math.min(newCurrentValue, this.total));
        
        if (this.current == 0) {
        
            this.tsDeath = +new Date();
        
            EventManager.publish('entityDestroyed', this._e);
        
        }
    
    };
    
    // apply damage from an entity
    this.applyDamage = function(entity) {
    
        var damage = entity.DamageComponent.randomDamage();
    
        // handle damage reduction
        
        this.update(this.current - damage);
    
    }


}