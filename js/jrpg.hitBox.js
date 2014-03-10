JRPG.HitBox = function(obj) {

    this.obj = obj;
    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;
    this.x2 = 0;
    this.y2 = 0;
    this.cx = 0;
    this.cy = 0;
    
    this.refresh = function() {
    
        this.x = this.obj.x - this.obj.width / 2;
        this.y = this.obj.y - this.obj.height;
        this.width = this.obj.width;
        this.height = this.obj.height;
        this.x2 = this.x + this.width;
        this.y2 = this.y + this.height;
        this.cx = this.obj.x;
        this.cy = this.y + this.height / 2;
    
    };
    
    /*
    ** checks if the center of the object is within the
    ** hit area    
    */    
    this.test = function(obj) {
    
        return obj.hitBox.cx >= this.x && 
               obj.hitBox.cx <= this.x2 && 
               obj.hitBox.cy >= this.y && 
               obj.hitBox.cy <= this.y2;
    
    };
    
    this.refresh();

}