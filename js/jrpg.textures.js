/*
*  2014/3/16
*/
JRPG.Textures = {

    textures: {}, 
    
    // for right side of character
    // this is flipped for down-left, left and up-left
    equipmentTexturesOrder: ['offhand1', 'weapon1'],

    load: function(key, path, createMirrors, callback, args) {
    
        var img = new Image();
        img.key = key;
        img.callback = callback;
        img.args = args;
        img.createMirrors = createMirrors;
        img.onload = function() {

            if (this.createMirrors) {
            
                var canvas = document.createElement('canvas'), 
                    ctx = canvas.getContext('2d'), 
                    rowHeight = this.height / 5;
                
                canvas.width = this.width;
                canvas.height = this.height + rowHeight * 3;
                
                ctx.drawImage(this, 0, 0);
                ctx.translate(this.width, 0);
                ctx.scale(-1, 1);
                ctx.drawImage(this, 0, 3 * rowHeight, this.width, rowHeight, 0, this.height, this.width, rowHeight);
                ctx.drawImage(this, 0, 2 * rowHeight, this.width, rowHeight, 0, this.height + rowHeight, this.width, rowHeight);
                ctx.drawImage(this, 0, rowHeight, this.width, rowHeight, 0, this.height + 2 * rowHeight, this.width, rowHeight);
                
                JRPG.Textures.textures[this.key] = canvas;
            
            } else {
            
                JRPG.Textures.textures[this.key] = this;
            
            }
            
            if (this.callback) {
                
                this.callback.apply(this, this.args);
            
            }
        
        }
        img.src = path;
    
    }, 
    
    character: function(character, callback) {
    
        var keys = [], 
            key, canvas, tex, ctx;
        
        if (!this.textures[character.type]) {
        
            keys.push(character.type);
        
        }
        
        _.each(character.equipment, function(i) {
        
            if (i instanceof JRPG.Item && !this.textures[i.type]) {
            
                keys.push(i.type);
            
            }
        
        }, this); 

        if (keys.length > 0) {
        
            key = keys.shift();
            
            this.load(key, 'tex/' + key + '.png', true, $.proxy(this.character, this), [character, callback]);
        
        } 
        // all textures are loaded, we can stack the hero now
        else {
        
            tex = this.textures[character.type];
            canvas = document.createElement('canvas');
            canvas.width = tex.width;
            canvas.height = tex.height;
            ctx = canvas.getContext('2d');
            
            ctx.drawImage(tex, 0, 0);
            
            _.each(this.equipmentTexturesOrder, function(i) {
  
                if (character.equipment[i] != null) {
                
                    tex = this.textures[character.equipment[i].type];
                    
                    ctx.drawImage(tex, 0, 0);
                
                }
            
            }, this);
            
            this.textures[character.type + '_complete'] = canvas;
            
            callback();
        
        }  
    
    }

}
