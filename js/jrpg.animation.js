/* 2014/5/18 */
JRPG.Animation = function(owner, row, colStart, colEnd, duration, loop) {

    this.owner = null;
    this.tsStart = -1;
    this.callback = null;
    this.data = null;
    this.row = 0;
    this.colStart = 0;
    this.colEnd = 0;
    this.duration = 0;
    this.frameCount = 0;
    this.loop = false;

    this.initAnimation = function(owner, row, colStart, colEnd, duration, loop) {
    
        this.owner = owner;
        this.callback = null;
        this.data = null;
        this.row = row;
        this.colStart = colStart;
        this.colEnd = colEnd;
        this.duration = duration;
        this.frameCount = this.colEnd - this.colStart;
        this.loop = loop || false; 
    
    }

    this.getFrame = function() {
    
        var duration = this.duration == 'auto' ? 1 / this.owner.attr('speed-current') : this.duration, 
            msPerFrame = 1000 * duration / this.frameCount, 
            ts = +new Date() - this.tsStart, 
            frame = this.colStart + (Math.floor(ts / msPerFrame) % this.frameCount);

        if (!this.loop && ts > duration * 1000) {
        
            this.tsStart = -1;
            
            if (this.callback) {

                this.callback.apply(this, this.data);
            
            }
        
        }
        
        return { frame: frame, offsetX: 0, offsetY: 0 };
    
    }; 
    
    this.initAnimation(owner, row, colStart, colEnd, duration, loop);

}

JRPG.LeapAnimation = function(owner, height, targetX, targetY, duration) {

    this.height = 0;
    this.targetX = 0;
    this.targetY = 0;
    this.distance = 0;
    this.durationMS = 0;

    this.initLeapAnimation = function(owner, height, targetX, targetY, duration) {
    
        this.initAnimation(owner, 0, 0, 0, duration, false);   
        
        this.height = height;
        this.targetX = targetX;
        this.targetY = targetY;
        this.distance = _dist(this.owner.x, this.owner.y, this.targetX, this.targetY);
        this.durationMS = this.duration * 1000;
        this.dx = (this.targetX - this.owner.x) / this.distance;
        this.dy = (this.targetY - this.owner.y) / this.distance;
    
    };
 
    this.getFrame = function() {

        var ticks = +new Date() - this.tsStart,
            perc = ticks / this.durationMS,  
            progress = this.distance * perc, 
            offsetX = this.dx * progress, 
            offsetY = this.dy * progress + Math.sin(_radians(perc * 180)) * this.height * -1; 
        
        if (this.durationMS - ticks < 0) {
        
            this.tsStart = -1;
            this.owner.updatePosition(this.targetX, this.targetY);
        
        } 

        return { frame: 0, offsetX: offsetX, offsetY: offsetY };
    
    } 
    
    this.initLeapAnimation(owner, height, targetX, targetY, duration);   

}
JRPG.LeapAnimation.prototype = new JRPG.Animation();
