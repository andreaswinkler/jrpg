var RenderComponent = function(entity, settings) {

    this._e = entity;
    
    this.x = 0;
    this.y = 0;
    
    this.offsetX = 0;
    this.offsetY = 0;
    
    this.hitArea = { x: 0, y: 0, x2: 0, y2: 0 };
    
    this.useMirroredSprites = settings.useMirroredSprites || false;
    
    this.drawHitArea = settings.drawHitArea || false;
    
    this.texture = this.useMirroredSprites ? this._e.type + '_complete' : this._e.type;
    
    this.halfWidth = this._e.width / 2;
    
    this.textureRowDead = settings.textureRowDead || 0;
    
    this.layer = settings.layer || 'objects';
    
    this.localize = function(root) {
    
        var y = this._e.y - root.y;
    
        this.x = this._e.x - root.x - this.halfWidth;
        this.y = y - this._e.height;
        
        this.hitArea.x = this.x;
        this.hitArea.y = this.y;
        this.hitArea.x2 = this.x + this._e.width;
        this.hitArea.y2 = y;
        
        if (this._e.tsDeath > 0) {
        
            this.offsetY = this.textureRowDead * this._e.height;
        
        } else {
        
            this.offsetY = RenderComponent.rotationToTextureRow(this._e.rotation) * this._e.height;
        
        } 
        
        // check if any animation is messing with our offsets
        if (this._e.AnimationComponent) {
        
            this.x += this._e.AnimationComponent.offsetX;
            this.y += this._e.AnimationComponent.offsetY;
            
            this.offsetX = this._e.AnimationComponent.frame * this._e.width;

        }
        
    }
       
} 

RenderComponent.rotationToTextureRow = function(r) {

    var rotDeg = r * (180 / Math.PI),  
        texRow = 0;

    rotDeg = rotDeg < 0 ? rotDeg * -1 : 180 + (180 - rotDeg);
    
    if (rotDeg > 337.5 || rotDeg < 22.5) {
        texRow = 2;
    } else if (rotDeg < 67.5) {
        texRow = 1;
    } else if (rotDeg < 112.5) {
        texRow = 0;
    } else if (rotDeg < 157.5) {
        texRow = 7;
    } else if (rotDeg < 202.5) {
        texRow = 6;
    } else if (rotDeg < 247.5) {
        texRow = 5;
    } else if (rotDeg < 292.5) {
        texRow = 4;        
    } else if (rotDeg < 337.5) {
        texRow = 3;
    } 
    
    return texRow;         

}      