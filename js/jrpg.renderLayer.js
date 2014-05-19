/*
** 2014/3/11
*/
JRPG.RenderLayer = function(width, height) {

    this.width = width;
    this.height = height;
    
    this.e = $('<canvas width="' + this.width + '" height="' + this.height + '"></canvas>');
    this.canvas = this.e.get(0);
    this.ctx = this.canvas.getContext('2d');
    
    this.clear = function(color) {
    
        if (color) {
        
            this.ctx.rect(0, 0, this.width, this.height, color);
        
        } else {
    
            this.ctx.clearRect(0, 0, this.width, this.height);
        
        }    
    
    };
    
    this.rect = function(x, y, w, h, fs, ss) {
    
        this.ctx.fillStyle = fs || '#000';
        this.ctx.strokeStyle = ss || '#000';
        this.ctx.fillRect(x, y, w, h);
        this.ctx.stroke();
    
    };
    
    this.circle = function(x, y, r, fs, ss, lineWidth) {
    
        this.ctx.fillStyle = fs || '#000';
        this.ctx.strokeStyle = ss || '#000';
        this.ctx.lineWidth = lineWidth || 1;
        this.ctx.beginPath();
        this.ctx.arc(x, y, r, 0, Math.PI * 2, true);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();    
    
    };
    
    this.drawRotated = function(canvas, x, y, rot) {
    
        // todo: draw something
    
    };
    
    this.drawMasked = function(maskCanvas, canvas, x, y) {
    
        this.ctx.save();
    
        this.ctx.drawImage(maskCanvas, x, y);
        //this.circle(100, 100, 50, 'rgba(0,210,0,1)');
        this.ctx.globalCompositeOperation = 'source-in';
        //this.rect(20, 20, 100, 100, 'rgba(210,0,0,1)');
        this.ctx.drawImage(canvas, x, y);
        
        this.ctx.restore();
    
    };
    
    this.pixel = function(x, y) {
    
        return this.ctx.getImageData(x, y, 1, 1).data;
    
    };
    
    this.textbox = function(x, y, text, color, borderColor) {
    
        var w;
    
        this.ctx.font = 'italic 12px Arial';
        
        w = this.ctx.measureText(text).width;
        
        this.rect(x - 3, y, w + 3, 15, color, borderColor);
        
        this.ctx.fillStyle = borderColor;
        this.ctx.fillText(text, x, y + 12);

    };
      
}