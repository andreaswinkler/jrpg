JRPG.MovingObject = function(type, name, level, speed) {

    this.target = null;

    this.initMovingObject = function(type, name, level, speed) {
    
        this.initObject(type, name, level); 
        
        this.attr('speed', speed);
        
        this.initCurrentAttributeValue('speed');  
    
    };

    /*
    ** tell the creature to move to a the current position of 
    ** a specific target    
    */    
    this.moveToObj = function(obj, cb) {
    
        this.moveTo(obj.x, obj.y, obj, cb);
    
    };
    
    /*
    ** tell the creature to move to a specific position
    ** a target object and callback can be defined  
    **
    ** the method also sets the rotation of the creature accordingly          
    */    
    this.moveTo = function(x, y, obj, cb) {
    
        // calculate the distance between the current and target
        // position
        var dist = _dist(x, y, this.x, this.y);
    
        // set the target object (target position, x/y change per step, 
        // target object and callback
        this.target = { 
            x: x, 
            y: y, 
            dx: (x - this.x) / dist, 
            dy: (y - this.y) / dist, 
            obj: obj, 
            cb: cb 
        };
        
        // set the rotation of the creature towards
        // the target
        this.rotation = _rot(x, y, this.x, this.y);

    };
    
    /*
    ** handle everything moving objects do in a single frame 
    */ 
    this.movingObjectLoop = function(ticks) {
    
        this.objectLoop(ticks);
        
        // first let's check for a target
        if (this.target) {
        
            this.move(ticks);
        
        }
    
    };
    
    /*
    ** move to the target   
    */    
    this.approachTarget = function() {
    
        this.moveToObj(this.target);
    
    };
       
    this.loop = function(ticks) {
    
        this.movingObjectLoop(ticks);
    
    };
    
    /*
    ** check if the object has reached its target
    */    
    this.reachedTarget = function() {
    
        if (this.target) {
        
            // normalize our position
            if (this.x > this.target.x && this.target.dx > 0 || this.x < this.target.x && this.target.dx < 0) {
            
                this.x = this.target.x;
            }
        
            if (this.y > this.target.y && this.target.dy > 0 || this.y < this.target.y && this.target.dy < 0) {
                
                this.y = this.target.y;
            
            } 
            
            // let's check if our coordinates match the target ones
            if (this.x == this.target.x && this.y == this.target.y) {   
            
                // we reached our target
                return true;
            
            }
            
            // we didn't reach our target yet
            return false;
        
        } 
        
        // we have no target, so we are already there
        return true;   
    
    };
    
    /*
    ** the creature moves towards its target
    ** the distance travelled per frame is calculated from the amount 
    ** of ticks times the speed of the creature        
    */    
    this.move = function(ticks) {
    
        var currentSpeed, cb, newX, newY;
    
        if (this.target) {
        
            currentSpeed = this.attr('speed-current') * ticks;
        
            newX = this.x + this.target.dx * currentSpeed;
            newY = this.y + this.target.dy * currentSpeed;
            
            if (JRPG.game.map.canMoveTo(this, newX, newY)) {
        
                this.updatePosition(newX, newY); 
                        
                if (this.reachedTarget()) {
                
                    cb = this.target.cb;
                    
                    this.stop();
                
                    if (cb) {
                    
                        cb.call();
                    
                    }
                
                }
            
            } else {
            
                this.stop();
            
            }
        
        }
    
    };
    
    /*
    ** stop the creature from moving
    */    
    this.stop = function() {
    
        this.target = null;
    
    };
    
    if (type) {
    
        this.initMovingObject(type, name, level, speed);  
    
    }  

}
JRPG.MovingObject.prototype = new JRPG.Object();