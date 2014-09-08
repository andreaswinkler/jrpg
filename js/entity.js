var Entity = function(settings) {

    this.type = settings.type || 'undefined';
    
    this.superType = settings.superType || 'undefined';
    
    this.name = settings.name || 'unnamed'; 
    
    this.width = settings.width || 0;
    
    this.height = settings.height || 0;
    
    // the horizontal position on the screen
    this.x = settings.x || 0;
    
    // the vertical position on the screen
    this.y = settings.y || 0;
    
    // the 'vertical offset' indicating an elevation
    this.z = settings.z || 0;
    
    // the hitbox
    this.hitBox = { x: 0, y: 0, x2: 0, y2: 0 };
    
    // the sprite rotation
    this.rotation = 0;
    
    // is this a creature
    this.isCreature = false;
    
    // recalculate all stats after equipment changes, etc.
    this.refresh = function() {
    
        _.each(['StatsComponent', 'HealthComponent', 'ManaComponent', 'DamageComponent'], function(component) {
        
            if (this[component] && this[component].refresh) {
            
                this[component].refresh();
            
            }
        
        }, this);
    
    };
    
    // update the hitbox
    this.updateHitBox = function() {
    
        this.hitBox.x = parseInt(this.x - this.width / 2);
        this.hitBox.y = parseInt(this.y - this.height);
        this.hitBox.x2 = parseInt(this.x + this.width / 2);
        this.hitBox.y2 = parseInt(this.y);
    
    };
    
    // updates the position 
    this.updatePosition = function(x, y) {
    
        //if (SceneManager.positionValid(x, y)) {
        
            this.x = x;
            this.y = y;
            
            this.updateHitBox();
            
            return true;
        
        //}
        
        //return false;
    
    };
    
    // updates the rotation attribute of the position component by 
    // calculating the vector between its position and given x/y coordinates
    this.updateRotation = function(x, y) {
    
        this.rotation = this.direction(x, y);
    
    };
    
    // check if the current position equals a given one
    this.positionEquals = function(x, y) {
    
        return this.x == x && this.y == y;
    
    };
    
    // make a hittest against an entity
    this.hitTestEntity = function(entity) {
    
        return this.hitBox.x < entity.hitBox.x2 && this.hitBox.x2 > entity.hitBox.x && this.hitBox.y < entity.hitBox.y2 && this.hitBox.y2 > entity.hitBox.y;
    
    };
    
    this.hitTest = function(x, y) {
    
        return this.hitBox.x <= x && this.hitBox.x2 >= x && this.hitBox.y <= y && this.hitBox.y2 >= y;
    
    };
    
    // returns the rotation between the PositionComponents position 
    // and given x/y coordinates
    this.direction = function(x, y) {
    
        var d = this.distance(x, y), 
            ax = (x - this.x) / d;
        
        return y - this.y > 0 ? Math.cos(ax) - Math.PI : Math.acos(ax * -1);    
    
    };
    
    // returns the distance between the PositionComponents position
    // and given x/y coordinates
    this.distance = function(x, y) {
    
        return Math.sqrt((x - this.x) * (x - this.x) + (y - this.y) * (y - this.y));    
    
    }; 
    
    // checks if this entity is in a given range of another entity
    this.inRange = function(otherBaseComponent, range) {
    
        return this.distance(otherBaseComponent.x, otherBaseComponent.y) <= range;
    
    };
    
    this.toString = function() {
    
        return '[' + this.name + '(#' + this._id + ')]: ';
    
    }
    
    this.updateHitBox();  

}