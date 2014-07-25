var AggroComponent = function(entity, settings) {

    this._e = entity;
    
    this.possibleAggroTargets = null;

    this.range = settings.range || 0;
    
    this.target = null;
    
    // the distance to the target
    this.distance = 0;
    
    this.loop = function(ticks) {
    
        // we don't have an aggro target, let's try to get one
        if (this.target == null) {
    
            if (this.possibleAggroTargets == null) {
            
                this.possibleAggroTargets = EntityManager.getAggroTargets(this._e.type);
            
            } 
            
            for (i = 0; i < this.possibleAggroTargets.length; i++) {
            
                if (this._e.inRange(this.possibleAggroTargets[i], this.range)) {
                
                    this.target = this.possibleAggroTargets[i];
                    
                    console.log(this._e.name + ' chooses target <' + this.target.name + '>');
                    
                    break;
                
                }
            
            }
        
        } 
        
        // if we have a target we store the distance
        if (this.target != null) {
        
            this.distance = this._e.distance(this.target.x, this.target.y);
        
            // the target is too far away, let's leave 'em alone
            if (this.distance > this.range) {
            
                this.target = null;
            
            }
        
        }         
    
    }

}