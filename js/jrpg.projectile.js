/*
** 2014/02/13
**
** target can be either a creature/object or a position
*/
JRPG.Projectile = function(type, src, target, speed, range, width, height) {

    this.startX = 0;
    this.startY = 0;
    this.range = 0;

    this.initProjectile = function(type, src, target, speed, range, width, height) {
    
        this.initMovingObject(type, type, 0, speed);
        
        this.range = range;
        this.startX = src.x;
        this.startY = src.y;
        
        this.width = width;
        this.height = height;
        
        this.owner = src;
        this.attributes.flying = true;
        
        // place the projectile on the position of the source
        this.updatePosition(this.startX, this.startY);
        
        // send the projectile on it's way
        this.moveTo(target.x, target.y);
    
    }; 
    
    this.projectileLoop = function(ticks) {
    
        var hit;
    
        this.movingObjectLoop(ticks);

        // if the projectile was stopped by something
        // we remove it
        if (this.target == null) {
        
            this.remove();
        
        }
        // if the projectile reached the end of its range,
        // we remove it
        else if (this.range < _dist(this.startX, this.startY, this.x, this.y)) {
        
            this.remove();
        
        } 
        // otherwise we make a hittest
        else {
        
            hit = JRPG.game.hitTest(this);

            // we hit something, let's apply some damage!
            if (hit) {
            
                JRPG.Skills.applyDamage(this.type, this.owner, hit);
                
                this.remove();        
            
            }        
        
        }
    
    };
    
    this.loop = function(ticks) {
    
        this.projectileLoop(ticks);        
    
    };
    
    this.initProjectile(type, src, target, speed, range, width, height);               

}
JRPG.Projectile.prototype = new JRPG.MovingObject();
