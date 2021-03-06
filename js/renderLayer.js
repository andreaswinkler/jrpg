/*
** 2014/3/11
*/
var RenderLayer = function(width, height) {

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
        
        return this;  
    
    };
    
    this.rect = function(x, y, w, h, fs, ss) {
    
        this.ctx.fillStyle = fs || '#000';
        this.ctx.strokeStyle = ss || '#000';
        this.ctx.fillRect(x, y, w, h);
        this.ctx.stroke();
        
        return this;
    
    };
    
    this.isoRect = function(x, y, w, h, fs, ss) {
    
        this.ctx.fillStyle = fs || '#000';
        this.ctx.strokeStyle = ss || '#000';
        
        this.ctx.beginPath();
        this.ctx.moveTo(x + w / 2, y);
        this.ctx.lineTo(x, y + h / 2);
        this.ctx.lineTo(x + w / 2, y + h);
        this.ctx.lineTo(x + w, y + h / 2);
        this.ctx.lineTo(x + w / 2, y);
        this.ctx.stroke();
        
        return this;    
    
    };
    
    this.alpha = function(alpha) {
    
        this.ctx.globalAlpha = alpha;
        
        return this;
    
    };
    
    this.opaque = function() {
    
        this.ctx.globalAlpha = 1.0;
        
        return this;
    
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
        
        return this;   
    
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
        
        return this;
    
    };
    
    this.pixel = function(x, y) {
    
        return this.ctx.getImageData(x, y, 1, 1).data;
    
    };
    
    this.text = function(x, y, text, color, textStyle) {
    
        this.ctx.font = textStyle || 'italic 18px Arial';
        
        this.ctx.fillStyle = color;
        this.ctx.fillText(text, x, y);
        
        return this;    
    
    };
    
    this.textbox = function(x, y, text, color, borderColor, textStyle) {
    
        var w;
    
        this.ctx.font = textStyle || 'italic 12px Arial';
        
        w = this.ctx.measureText(text).width;
        
        this.rect(x - 3, y, w + 3, 15, color, borderColor);
        
        this.ctx.fillStyle = borderColor;
        this.ctx.fillText(text, x, y + 12);
        
        return this;

    };
                         
    this.image = function(src, sx, sy, sw, sh, x, y, w, h) {
    
        this.ctx.drawImage(src, sx, sy, sw, sh, x, y, w, h);
        
        return this;    
    
    };
    
    this.bar = function(x, y, width, height, fillPercent, backgroundColor, foregroundColor, text, textStyle, textColor) {
        
        var w;
        
        this.rect(x, y, width, height, backgroundColor);
        this.rect(x + 1, y + 1, fillPercent * (width - 2), height - 2, foregroundColor);
    
        if (text) {
        
            w = this.ctx.measureText(text).width;
        
            this.text(x + width / 2 - w / 2, y + 8, text, textColor, textStyle);
        
        }
        
        return this;
    
    };
    
    this.rotate = function(x, y, r) {
    
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(r);
        
        return this;
    
    };
      
}