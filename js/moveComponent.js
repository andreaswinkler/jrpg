/*
** the move component
*/
var MoveComponent = function(entity, settings) {

    // a reference to the position component
    // of the parent entity
    this._e = entity;

    // the speed
    this.speed = settings.speed || 0;
    
    // the range
    this.range = settings.range || -1;

    // the target description, if any
    this.target = null;
    
    // a direction vector that is multiplied with the 
    // move vector and is used to guide creatures away
    // from each other
    this.drift = { x: 0, y: 0 };
    
    // has the object changed its position since 
    // the last frame?
    this.hasMoved = false;
    
    /*
    ** tell the creature to move to a specific position
    ** a target object and callback can be defined  
    **
    ** the method also sets the rotation of the creature accordingly          
    */    
    this.moveTo = function(x, y) {
    
        // calculate the distance between the current and target
        // position
        var dist = this._e.distance(x, y);

        // set the target object (target position, x/y change per step, 
        // target object and callback
        this.target = { 
            x: x, 
            y: y, 
            dx: (x - this._e.x) / dist, 
            dy: (y - this._e.y) / dist
        };
        
        // set the rotation of the creature towards
        // the target
        this._e.updateRotation(x, y);

    };
    
    /*
    ** the creature moves towards its target
    ** the distance travelled per frame is calculated from the amount 
    ** of ticks times the speed of the creature 
    **
    ** if the target is our aggro target we update the target frequently               
    */    
    this.loop = function(ticks) {
    
        var currentSpeed, newX, newY, distanceTravelled;
    
        if (this.target) {
        
            currentSpeed = this.speed * ticks;
        
            newX = (this._e.x + this.target.dx * currentSpeed) + this.drift.x;
            newY = (this._e.y + this.target.dy * currentSpeed) + this.drift.y;
            
            distanceTravelled = this._e.distance(newX, newY);
            
            // update position fails if the entity cannot be placed on the
            // provided coordinates
            if (this._e.updatePosition(newX, newY)) {
            
                // normalize the position
                this.normalizePosition();
            
                // check if the target was reached
                if (this.targetReached()) {
                
                    this.stop();
                
                } 
                
                // if we don't have unlimited range, we check our range
                // left, if we don't have any, let's remove ourselves
                if (this.range > -1) {
                
                    this.range = Math.max(0, this.range - distanceTravelled);
                    
                    if (this.range == 0) {
                    
                        EntityManger.stack.remove(this);
                    
                    }    
                
                }   
            
            } else {
            
                this.stop();            
            
            }
        
        }
    
    };
    
    this.normalizePosition = function() {
    
        // normalize our position
        if ((this._e.x > this.target.x && this.target.dx > 0) || (this._e.x < this.target.x && this.target.dx < 0)) {
        
            this._e.x = this.target.x;
        }
    
        if ((this._e.y > this.target.y && this.target.dy > 0) || (this._e.y < this.target.y && this.target.dy < 0)) {
            
            this._e.y = this.target.y;
        
        }     
    
    };
    
    /*
    ** check if the object has reached its target
    */    
    this.targetReached = function() {
    
        if (this.target) {
        
            // let's check if our coordinates match the target ones
            return this._e.positionEquals(this.target.x, this.target.y);
        
        } 
        
        // we have no target, so we are already there
        return true;   
    
    };
    
    
    
    /*
    ** stop the creature from moving
    */    
    this.stop = function() {
    
        this.target = null;
    
    };

}