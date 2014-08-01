/*
** AGGRO COMPONENT
**
** Deals with the aggro target of an entity (creature). The component
** holds a range property that is used to determine wether or not the 
** creature gets an aggro target.
**
** Each frame the component validates an existing aggro target (if any). If 
** it is too far away (outside the aggro range) the creature forgets about 
** him. If no aggro target exists the component tries to find one by loading
** all possible targets from the EntityManager and takes the first one as 
** an aggro target.
*/
var AggroComponent = function(entity, settings) {

    // we hold a reference to the entity itself
    this._e = entity;
    
    // we hold the list of possible aggro targets so we don't need 
    // to reload them everytime we need a new target. For creatures 
    // this list will hold all heroes
    this.possibleAggroTargets = null;

    // the aggro range of this entity
    this.range = settings.range || 0;
    
    // the current aggro target
    this.target = null;
    
    // the distance to the target
    this.distance = 0;
    
    /*
    ** Each frame we check if a target exists. If we don't have one we try
    ** to find one by taking the first one of the possible aggro targets 
    ** which is within our aggro range.
    ** If we have one we check if it is still within our range, otherwise
    ** we dismiss him.                 
    */    
    this.loop = function(ticks) {
    
        // we don't have an aggro target, let's try to get one
        if (this.target == null) {
    
            // if we don't have a possible aggro targets list yet, we 
            // load it from the EntityManager. This is only done once so 
            // we need to handle later additions to the entity pool somehow
            if (this.possibleAggroTargets == null) {
            
                this.possibleAggroTargets = EntityManager.getAggroTargets(this._e.type);
            
            } 
            
            // we loop through all the possible targets and get the first
            // one within our aggro range
            for (i = 0; i < this.possibleAggroTargets.length; i++) {
            
                if (this._e.inRange(this.possibleAggroTargets[i], this.range)) {
                
                    this.target = this.possibleAggroTargets[i];
                    
                    console.log(this._e.toString() + ' chooses target <' + this.target.name + '>');
                    
                    break;
                
                }
            
            }
        
        } 
        
        // if we have a target we store the distance
        if (this.target != null) {
        
            // the target is dead, let's leave his corpse alone
            if (this.target.HealthComponent.tsDeath != undefined) {
            
                this.target = null;
            
            } else {
        
                this.distance = this._e.distance(this.target.x, this.target.y);
            
                // the target is too far away, let's leave 'em alone
                if (this.distance > this.range) {
                
                    console.log(this._e.toString() + ' lost target <' + this.target.name + '> [TooFarAway]');
                
                    this.target = null;
                
                }
            
            }
        
        }         
    
    }

}