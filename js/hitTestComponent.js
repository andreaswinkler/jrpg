/*
** HIT TEST COMPONENT
**
** handles the hit testing between too entities
*/
var HitTestComponent = function(entity, settings) {

    this._e = entity;

    this.types = settings.types || [];
    
    this.behaviors = settings.behaviors || [];
    
    /*
    ** the loop method
    **
    ** loops through the stack to get all entities of the target 
    ** type and makes a hittest against them
    ** if the hit test passes all registered behaviors take place                
    */    
    this.loop = function(ticks) {
    
        // loop through all entities
        _.each(EntityManager.stack, function(i) {
        
            // check if the entity is of a matching type
            if (this.types.indexOf(i.type) != -1) {
                
                // we have a hit!
                if (i.hitTest(this._e)) {
                
                    // call all behaviros
                    _.each(this.behaviors, function(b) {
                    
                        HitTestComponent.behaviors[b](this._e, i);
                    
                    }, this); 
                
                }
            
            }
        
        }, this);    
    
    }

}

HitTestComponent.behaviors = {

    // applies damage from a source entity to a target one
    // used for most projectiles
    applyDamage: function(src, target) {
    
        target.HealthComponent.applyDamage(src);
    
    }, 
    
    // removes an entity after the hit test, valid for 
    // all projectiles except piercing ones
    remove: function(src, target) {
    
        EntityManager.stack.remove(src);
    
    }

}