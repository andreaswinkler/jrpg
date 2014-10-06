/*
*  2014/3/16
*/
var TextureSystem = {

    textures: {
        hero: { 
            settings: {
                frameCount: 17, 
                mirrorSprites: true,  
                animations: {
                    death: {
                        offset: 0, 
                        frameCount: 6, 
                        duration: 2,
                        loop: false
                    },
                    move: {
                        offset: 0,
                        frameCount: 8,
                        durationAttribute: 'speed_c',
                        loop: true 
                    },
                    bash: {
                        offset: 8, 
                        frameCount: 9,
                        durationMethod: 'attackSpeed',
                        loop: false
                    }
                }
            }
        },
        hystrix: {
            settings: {
                frameCount: 1,
                mirrorSprites: true,  
                animations: {
                    death: {
                        offset: 0, 
                        frameCount: 6, 
                        duration: 2,
                        loop: false    
                    },
                    move: {
                        offset: 1,
                        frameCount: 12,
                        durationAttribute: 'speed_c',
                        loop: true     
                    }
                }
            }
        }    
    },
    
    loaded: [],  
    
    // for right side of character                                                                                           
    // this is flipped for down-left, left and up-left
    equipmentTexturesOrder: ['offhand1', 'weapon1'],

    settings: function(key) {
    
        if (this.textures[key] && this.textures[key].settings) {
        
            return this.textures[key].settings;
        
        }
        
        return null;
    
    }, 

    load: function(key, path, callback, args) {
    
        var img;
    
        if (this.loaded.indexOf(key) !== -1) {
            
            console.log('texture <' + key + '> already loaded.');
            
            if (callback) {
                
                callback.apply(this, args);
            
            }
                
        } else if (key != 'undefined') {
    
            if (key.indexOf('_complete') !== -1) {
            
                if (key.indexOf('hero')) {
                
                    this.character(EntityManager.hero());
                
                }    
            
            } else {
    
                console.log('load texture <' + key + '> from <' + path + '>');
            
                this.loaded.push(key);
            
                if (!TextureSystem.textures[key]) {
                    
                    TextureSystem.textures[key] = {};    
                    
                }
            
                img = new Image();
                img.key = key;
                img.callback = callback;
                img.args = args;
                img.onload = function() {
        
                    var texture = TextureSystem.textures[this.key], 
                        settings = texture.settings, 
                        mirrorSprites = settings && settings.mirrorSprites,  
                        canvas, ctx, rowHeight, frameCount, colWidth, i, j;
  
                    console.log('texture <' + this.key + '> loaded.');

                    if (mirrorSprites) {
                    
                        canvas = document.createElement('canvas'); 
                        ctx = canvas.getContext('2d'); 
                        rowHeight = this.height / 6;
                        frameCount = settings.frameCount; 
                        colWidth = this.width / frameCount; 
                        
                        canvas.width = this.width;
                        canvas.height = this.height + rowHeight * 3;
                        
                        ctx.drawImage(this, 0, 0);
                        ctx.translate(this.width, 0);
                        ctx.scale(-1, 1);
                        
                        for (i = 3, j = 1; i > 0; i--, j++) {
                        
                            for (k = 0; k < frameCount; k++) {
                            
                                ctx.drawImage(this, k * colWidth, i * rowHeight, colWidth, rowHeight, this.width - (k + 1) * colWidth, this.height + j * rowHeight, colWidth, rowHeight);
                            
                            }
                        
                        }
                        
                        texture.c = canvas;
                    
                    } else {
                    
                        texture.c = this;
                    
                    }
                    
                    if (this.callback) {
                        
                        this.callback.apply(this, this.args);
                    
                    }
                
                }
                img.src = path;
            
            }
        
        }
    
    }, 
    
    loadTextures: function(list, callback) {
    
        var key = list.shift(), 
            next = list.length > 0 ? $.proxy(this.loadMapTextures, this) : callback;
        
        this.load(key, 'tex/' + key + '.png', next, [list, callback]);   
    
    }, 
    
    character: function(character, callback) {
    
        var keys = [], 
            key, canvas, tex, ctx, 
            equipment = character.EquipmentComponent.getList();
        
        if (!this.textures[character.type]) {
        
            keys.push(character.type);
        
        }
        
        _.each(equipment, function(i) {
        
            if (!this.textures[i.type]) {
            
                keys.push(i.type);
            
            }
        
        }, this); 

        if (keys.length > 0) {
        
            key = keys.shift();
            
            this.load(key, 'tex/' + key + '.png', true, $.proxy(this.character, this), [character, callback, loadingBar]);
        
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
  
                if (equipment[i] != null) {
                
                    tex = this.textures[equipment[i].type];
                    
                    ctx.drawImage(tex, 0, 0);
                
                }
            
            }, this);
            
            this.textures[character.type + '_complete'] = canvas;
            
            callback();
        
        }  
    
    }

}
