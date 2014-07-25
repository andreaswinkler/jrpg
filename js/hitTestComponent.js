var HitTestComponent = function(entity, settings) {

    this._e = entity;

    this.types = settings.types || [];
    
    this.behaviors = settings.behaviors || [];
    
    this.loop = function(ticks) {
    
        _.each(EntityManager.stack, function(i) {
        
            if (this.types.indexOf(i.type)) {
            
                if (i.hitTest(this._e)) {
                
                    _.each(this.behaviors, function(b) {
                    
                        HitTestComponent.behaviors[b](this._e, i);
                    
                    }, this); 
                
                }
            
            }
        
        }, this);    
    
    }

}

HitTestComponent.behaviors = {

    applyDamage: function(src, target) {
    
        target.HealthComponent.applyDamage(src);
    
    }, 
    
    remove: function(src, target) {
    
        EntityManager.stack.remove(src);
    
    }

}